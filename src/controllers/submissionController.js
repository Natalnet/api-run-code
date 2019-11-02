const {c, cpp, node, python, java} = require('compile-run')
const path = require('path')
const {URL_GCC} = require('../env')

class SubmissionController{
    async exec(req,res){
    	try{
			let { codigo,linguagem,results } = req.body;
			console.log(codigo);
			let totalTestes = results.length
    		let totalCertas =0
			console.log('vetor de testes:');
			console.log(results);
			let info=[];
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

				//retira todos espaçoes vazios do lado direito de cada linha do código
				results[i].saidaResposta = results[i].saidaResposta.split('\n').map(row=>row.replace(/\s+$/,'')).join('')
				results[i].output = results[i].output.split('\n').map(row=>row.replace(/\s+$/,'')).join('')

		    	//retira os caractere especiais '\n' do final do código'
				results[i].saidaResposta = results[i].saidaResposta.replace(/\n+$/,'')
				results[i].output = results[i].output.replace(/\n+$/,'')

				//verifica se a saída de teste bateu com a saída do programa
				results[i].isMatch = results[i].output === results[i].saidaResposta;
				console.log(`---------${i +1}° teste--------:\nEntrada(s) de teste:\n${options.stdin}Saída esperada p/ teste:\n${results[i].output}\nSaída do seu programa:\n${results[i].saidaResposta}\n-------fim da execução-----\n\n`);
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
		    		info.push(`//Erro no ${i +1}° teste---------:\n${results[i].stderr}\n'errorType: ${results[i].errorType}'\n'exitCode: ${results[i].exitCode}'\n//-----fim da execução------\n\n`)

		    	}
		    	else{
		    		info.push(`//--------${i +1}° teste---------:\n'isMatch:' ${results[i].isMatch}\n'Entrada(s) de teste:'\n${options.stdin}\n'Saída do seu programa:'\n${results[i].saidaResposta}\n'Saída esperada p/ teste:'\n${results[i].output}\n//-----fim da execução------\n\n`)
		    	}
		    	totalCertas = results[i].isMatch && !erro?totalCertas+1:totalCertas
		    }
		    console.log(results)
		    const percentualAcerto = (totalCertas/totalTestes*100).toFixed(2)
			//verifica se todos os erros são iguais, para mostrar só um erro e não o mesmo erro para cada caso de teste
			/*if(todosIguais(info)){
		  		info = info[0].split('\n')
		  		info.shift()
		  		info = info.join('\n')
		  		info = info.replace('\n//-----fim da execução------\n\n','')
		  	}else{
		  		info = info.join('')
		  	}*/
	    	return res.status(200).json({results,info,percentualAcerto,someErro})
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
	// converte todos valores para string
	vetor_teste = vetor_teste.map(val => `'${val}'`)
	// verifica quais valores podem ser convertidos para float
	//vetor_teste = vetor_teste.map(val => !isNaN(val)?parseFloat(val):val)
	
	console.log('-----vetor de testes que a função recebe---')
	console.log(vetor_teste)
	console.log('-------------------------------------------');
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
