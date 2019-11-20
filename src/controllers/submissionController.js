const {c, cpp, node, python, java} = require('compile-run')
const trataCodigoJS = require('../util/trataCodigoJS')
const todosIguais = require('../util/todosIguais')
const trataErroCPP = require('../util/trataErroCPP')
const trataErroJS = require('../util/trataErroJS')
const path = require('path')
const {URL_GCC} = require('../env')

class SubmissionController{
    async exec(req,res){
    	try{
			let { codigo,linguagem,results } = req.body;
			console.log(`lingiagem: ${linguagem}`);
			console.log(codigo);
			let totalTestes = results.length
    		let totalCertas =0
			console.log('vetor de testes:');
			console.log(results);
			let erros=[];
		    let options = {
		    	timeout         : 10000,
		    	compileTimeout  : 20000,
		    	stdin:'',
		    	compilationPath : linguagem === 'cpp'?URL_GCC:''
		    }
		    let resp_teste=''
		    let erro =''
		    let someErro= false		    
		    console.log('total de testes: '+ totalTestes);
		    for(let i in results){
		    	options.stdin = results[i].inputs
		    	if(linguagem==='javascript'){
		    		/*Implementa as funções prompt e alert ao codigo Javascript*/
		    		const codigoJsTratado = trataCodigoJS(codigo,options.stdin)
		    		resp_teste = await node.runSource(codigoJsTratado,options)	   	    		
		    		//trataErro js
		    		erro = resp_teste.stderr?trataErroJS(resp_teste.stderr):''
		    	}
		    	else if(linguagem==='cpp'){
		    		resp_teste = await cpp.runSource(codigo,options)
		    		/*console.log('resp_teste:');
		    		console.log(resp_teste);*/
		    		//trata erro cpp
		    		erro = resp_teste.stderr?trataErroCPP(resp_teste.stderr):''
		    	}
		    	//retira todos caracteres especiais '\r'
		    	results[i].saidaResposta = resp_teste.stdout?resp_teste.stdout.split('\r').join(''):''
				//retira todos espaçoes vazios do lado direito de cada linha do código
				results[i].saidaResposta = results[i].saidaResposta.split('\n').map(row=>row.replace(/\s+$/,'')).join('\n')
				results[i].output = results[i].output.split('\n').map(row=>row.replace(/\s+$/,'')).join('\n')
		    	//retira os caractere especiais '\n' do final do código'
				results[i].saidaResposta = results[i].saidaResposta.replace(/\n+$/,'')
				results[i].output = results[i].output.replace(/\n+$/,'')
				//verifica se a saída de teste bateu com a saída do programa
				results[i].isMatch = results[i].output === results[i].saidaResposta;
				//console.log(`---------${i +1}° teste--------:\nEntrada(s) de teste:\n${options.stdin}Saída esperada p/ teste:\n${results[i].output}\nSaída do seu programa:\n${results[i].saidaResposta}\n-------fim da execução-----\n\n`);
		    	if(erro){
		    		someErro = true
		    		console.log('---tipo do erro---');
		    		console.log(erro);
		    		console.log('-------------------');
			    	results[i].stderr = erro;
			    	results[i].errorType = resp_teste.errorType;
			    	results[i].exitCode = resp_teste.exitCode;
			    	results[i].memoryUsage = resp_teste.memoryUsage;
			    	results[i].cpuUsage = resp_teste.cpuUsage;
		    		erros.push(`${results[i].stderr}\nerrorType: ${results[i].errorType}\nexitCode: ${results[i].exitCode}`)
		    	}
		    	totalCertas = results[i].isMatch && !erro?totalCertas+1:totalCertas
		    }
		    console.log(results)
		    const percentualAcerto = (totalCertas/totalTestes*100).toFixed(2)
			//verifica se todos os erros são iguais, para mostrar só um erro e não o mesmo erro para cada caso de teste
			const descriptionErro = erros.length>0 && todosIguais(erros)?erros[0]:null
	    	return res.status(200).json({results,percentualAcerto,descriptionErro})
    	}
    	catch(err){
    		console.log('-------err------');
    		console.log(err)
    		console.log('----------------');
    		return res.status(500).json({err})
    	}

	}

    
    	
}
module.exports = new SubmissionController()
