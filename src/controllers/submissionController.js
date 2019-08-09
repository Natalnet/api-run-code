const {c, cpp, node, python, java} = require('compile-run')
const path = require('path')
const Question = require('../models/question')

class SubmissionController{
    async test(req,res){
    	try{
    		
			let { codigo,linguagem,results } = req.body;
			let totalTestes = results.length
    		let totalCertas =0
			console.log('vetor de testes:');
			console.log(results);
			let info=[];
		    let options = {
		    	timeout         : 10000,
		    	compileTimeout  : 10000,
		    	stdin:''
		    }
		    let resp_teste=''
		    let erro =''
		    const pathGCC = process.env.URL_GCC || path.normalize('C:/Program Files/CodeBlocks/MinGW/bin/gcc.exe')
	    	options.compilationPath = linguagem === 'cpp'?pathGCC:''
		    
		    console.log('total de testes: '+ totalTestes);
		    for(let i=0 ; i < totalTestes ; i++ ){
		    	options.stdin = results[i].inputs
		    	if(linguagem==='javascript'){
		    		let codigoComFuncoesJs = implementaFuncoesJS(codigo,options.stdin)
		    		//console.log(codigo);
		    		resp_teste = await node.runSource(codigoComFuncoesJs,options)	   	    		
		    		erro = resp_teste.stderr?resp_teste.stderr
		    		.split('\n')
		    		.filter((s,i) => i>=1 && i<=4)
		    		.join('\n'):''

		    	}
		    	else if(linguagem==='cpp'){
		    		resp_teste = await cpp.runSource(codigo,options)
		    		//filtra erro cpp
		    		erro = resp_teste.stderr?filtraErroCPP(resp_teste.stderr):''
		    	}
		    	//retira todos caracteres especiais '\r'
		    	results[i].saidaResposta = resp_teste.stdout.split('\r').join('')
		    	//retira o caractere especial '\n' caso seja o último caractere'
				results[i].saidaResposta = results[i].saidaResposta[results[i].saidaResposta.length-1]==='\n'?results[i].saidaResposta.slice(0,-1):results[i].saidaResposta
				//retira o caractere especial '\n' caso seja o último caractere'
				results[i].output = results[i].output[results[i].output.length-1]==='\n'?results[i].output.slice(0,-1):results[i].output
				//verifica se a saída de teste bateu com a saída do programa
				results[i].isMatch = results[i].output === results[i].saidaResposta;
				console.log(`---------${i +1}° teste--------:\nEntrada(s) de teste:\n${options.stdin}Saída esperada p/ teste:\n${results[i].output}\nSaída do seu programa:\n${results[i].saidaResposta}\n-------fim da execução-----\n\n`);
		    	if(erro){
		    		console.log('---tipo do erro---');
		    		console.log(erro);
		    		console.log('-------------------');
			    	results[i].stderr = erro;
			    	results[i].errorType = resp_teste.errorType;
			    	results[i].exitCode = resp_teste.exitCode;
			    	results[i].memoryUsage = resp_teste.memoryUsage;
			    	results[i].cpuUsage = resp_teste.cpuUsage;
		    		info.push(`//Erro no ${i +1}° teste---------:\n'erro:'\n ${results[i].stderr}\n'errorType: ${results[i].errorType}'\n'exitCode: ${results[i].exitCode}'\n//-----fim da execução------\n\n`)

		    	}
		    	else{
		    		info.push(`//--------${i +1}° teste---------:\n'isMatch:' ${results[i].isMatch}\n'Entrada(s) de teste:'\n${options.stdin}\n'Saída do seu programa:'\n${results[i].saidaResposta}\n'Saída esperada p/ teste:'\n${results[i].output}\n//-----fim da execução------\n\n`)
		    	}
		    	totalCertas = results[i].isMatch && !erro?totalCertas+1:totalCertas
		    }
		    console.log(results)
		    const percentualAcerto = (totalCertas/totalTestes*100).toFixed(2)
			//verifica se todos os erros são iguais, para mostrar só um erro e não o mesmo erro para cada caso de teste
			if(todosIguais(info)){
		  		info = info[0].split('\n')
		  		info.shift()
		  		info = info.join('\n')
		  	}else{
		  		info = info.join('')
		  	}
	    	return res.status(200).json({results,info,percentualAcerto})
    	}
    	catch(err){
    		console.log('-------err------');
    		console.log(Object.getOwnPropertyDescriptors(err))
    		console.log('----------------');
    		return res.status(500).json({err})
    	}

	}

    async exec(req,res){
    	try{
    		const id = req.params.id
    		const question = await Question.findById(id)
    		let results=[]
    		let totalTestes = question.results.length
    		let totalCertas =0
    		//obtendo só o array de objetos
    		for(let i = 0 ; i<totalTestes;i++){
    			results.push({
    				inputs:question.results[i].inputs,
    				output:question.results[i].output,
    				saidaResposta:'',
    				isMatch:'',
    				stderr:'',
    				errorType:'',
    				exitCode:'',
    				memoryUsage:'',
    				cpuUsage:''
    			})
    		}
			let { codigo,linguagem } = req.body;
			let info=[];
		    let options = {
		    	timeout         : 10000,
		    	compileTimeout  : 10000,
		    	stdin:''
		    }
		    let resp_teste=''
		    let erro = ''
		    const pathGCC = process.env.URL_GCC || path.normalize('C:/Program Files/CodeBlocks/MinGW/bin/gcc.exe')
	    	options.compilationPath = linguagem === 'cpp'?pathGCC:''
		    
		    console.log('total de testes: '+ totalTestes);
		    for(let i=0 ; i < totalTestes ; i++ ){
		    	options.stdin = results[i].inputs
		    	if(linguagem==='javascript'){
		    		let codigoComFuncoesJs = implementaFuncoesJS(codigo,options.stdin)
		    		//console.log(codigo);
		    		resp_teste = await node.runSource(codigoComFuncoesJs,options)	   	    		
		    		erro = resp_teste.stderr?resp_teste.stderr.split('\n').filter((s,i) => i>=1 && i<=4).join('\n'):''

		    	}
		    	else if(linguagem==='cpp'){
		    		resp_teste = await cpp.runSource(codigo,options)
					//filtra erro cpp
		    		erro = resp_teste.stderr?filtraErroCPP(resp_teste.stderr):''
		    		console.log('erro C++---------->\n'+erro+'\n----------')
		    	}
		    	//retira todos caracteres especiais '\r'
		    	results[i].saidaResposta = resp_teste.stdout.split('\r').join('')
		    	//retira o caractere especial '\n' caso seja o último caractere'
				results[i].saidaResposta = results[i].saidaResposta[results[i].saidaResposta.length-1]==='\n'?results[i].saidaResposta.slice(0,-1):results[i].saidaResposta
				//retira o caractere especial '\n' caso seja o último caractere'
				results[i].output = results[i].output[results[i].output.length-1]==='\n'?results[i].output.slice(0,-1):results[i].output
				//verifica se a saída de teste bateu com a saída do programa
				results[i].isMatch = results[i].output === results[i].saidaResposta;
				console.log(`---------${i +1}° teste--------:\nEntrada(s) de teste:\n${options.stdin}Saída esperada p/ teste:\n${results[i].output}\nSaída do seu programa:\n${results[i].saidaResposta}\n-------fim da execução-----\n\n`);
		    	if(erro){
		    		console.log('---tipo do erro---');
		    		console.log(erro)
		    		console.log('-------------------');
			    	results[i].stderr = erro;
			    	results[i].errorType = resp_teste.errorType;
			    	results[i].exitCode = resp_teste.exitCode;
			    	results[i].memoryUsage = resp_teste.memoryUsage;
			    	results[i].cpuUsage = resp_teste.cpuUsage;
		    		info.push(`//--------${i +1}° teste---------:\n'erro:'\n ${results[i].stderr}\n'errorType:' ${results[i].errorType}\n'exitCode:' ${results[i].exitCode}\n//-----fim da execução------\n\n`)
		    	}
		    	else{
		    		info.push(`//--------${i +1}° teste---------:\n'isMatch:' ${results[i].isMatch}\n'Entrada(s) de teste:'\n${options.stdin}\n'Saída do seu programa:'\n${results[i].saidaResposta}\n'Saída esperada p/ teste:'\n${results[i].output}\n//-----fim da execução------\n\n`)
		    	}
		    	totalCertas = results[i].isMatch && !erro?totalCertas+1:totalCertas

		    }
		    console.log(results)
			const percentualAcerto = (totalCertas/totalTestes*100).toFixed(2)	    			  	
			//verifica se todos os erros são iguais, para mostrar só um erro e não o mesmo erro para cada caso de teste
			if(todosIguais(info)){
		  		info = info[0].split('\n')
		  		info.shift()
		  		info = info.join('\n')
		  	}else{
		  		info = info.join('')
		  	}
		  	
			return res.status(200).json({results,info,percentualAcerto})
    	}
    	catch(err){
    		console.log('-------err------');
    		console.log(Object.getOwnPropertyDescriptors(err))
    		console.log('----------------');
    		return res.status(500).json({err})
    	}

	}
    	
}
/*Implementa as funções prompt e alert ao codigo Javascript*/
function implementaFuncoesJS(codigo,inputs_testes){
	let vetor_teste = inputs_testes.split('\n').slice(0,-1)
	vetor_teste = `[${vetor_teste.toString()}]`
	const s = ''+
	`let VETOR_TESTES = ${vetor_teste}\n`+
	"let INDECE_VETOR = 0\n"+
	"const prompt = () => {\n"+
		"let res = VETOR_TESTES[INDECE_VETOR]\n"+
		"INDECE_VETOR++\n"+
		"return res\n"+
	"}\n"+
	"const alert = (value) =>{\n"+
		"process.stdout.write(value.toString())\n"+
	"}\n"+
	codigo;
	//console.log(s);
	return s
}


function todosIguais(array) {
	array = array.map( elem =>{
		elem = elem.split('\n')
		elem.shift()
		elem = elem.join('\n')
		return elem
	})
	console.log('todos iguais---------------');
	console.log(array);
	for(let i= 0;i < array.length;i++){
		for(let j= 0;j < array.length;j++){
			if(array[i]!=array[j]) return false
		}
	}
	return true;
}

function filtraErroCPP(erroCPP){
	return erroCPP
		.split('\n')
		.filter((s,i) => i<=3)
		.map((s) => {
			if(s.indexOf(': ')!=-1){
				return s.slice(s.indexOf(': ')+2)
			}
			else if(s.indexOf('note: ')!=-1){
				return s.slice(s.indexOf('note: '))
			}
			else if(s.indexOf(':\r')!=-1){
				return s.slice(s.indexOf(':\r'))
			}
			return s
		})
		.join('\n')
}




module.exports = new SubmissionController()
