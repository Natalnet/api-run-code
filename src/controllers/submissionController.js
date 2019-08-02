const {c, cpp, node, python, java} = require('compile-run')
const path = require('path')

class SubmissionController{
    async test(req,res){
    	try{

			let { codigo,linguagem,results } = req.body;
			//console.log('vetor de testes:');
			//console.log(results);
			let info='';
		    let options = {
		    	timeout         : 10000,
		    	compileTimeout  : 10000,
		    	stdin:''
		    }
		    let resp_teste=''
		    const pathGCC = process.env.URL_GCC || path.normalize('C:/Program Files/CodeBlocks/MinGW/bin/gcc.exe')
	    	options.compilationPath = linguagem === 'cpp'?pathGCC:''
		    
		    console.log('total de testes: '+ results.length);
		    for(let i=0 ; i < results.length ; i++ ){
		    	options.stdin = results[i].inputs
		    	if(linguagem==='javascript'){
		    		let codigoComFuncoesJs = implementaFuncoesJS(codigo,options.stdin)
		    		//console.log(codigo);
		    		resp_teste = await node.runSource(codigoComFuncoesJs,options)	   	    		
		    	}
		    	else if(linguagem==='cpp'){
		    		resp_teste = await cpp.runSource(codigo,options)
		    	}
		    	resp_teste.stdout = resp_teste.stdout.replace(/\r/,'')
				results[i].saidaResposta = resp_teste.stdout
				results[i].isMatch = results[i].output === results[i].saidaResposta;
				console.log(`---------${i +1}° teste--------:\nEntrada(s) de teste:\n${options.stdin}Saída esperada p/ teste:\n${results[i].output}\nSaída do seu programa:\n${resp_teste.stdout}\n-------fim da execução-----\n\n`);
		    	if(resp_teste.stderr){
			    	results[i].stderr = resp_teste.stderr;
			    	results[i].errorType = resp_teste.errorType;
			    	results[i].exitCode = resp_teste.exitCode;
			    	results[i].memoryUsage = resp_teste.memoryUsage;
			    	results[i].cpuUsage = resp_teste.cpuUsage;
		    		info += `//--------${i +1}° teste---------:\n'erro:'\n ${results[i].stderr}\n'errorType:'\n${results[i].errorType}\n'exitCode:'\n${results[i].exitCode}\n//-----fim da execução------\n\n`

		    	}
		    	else{
		    		info += `//--------${i +1}° teste---------:\n'isMatch:' ${results[i].isMatch}\n'Entrada(s) de teste:'\n${options.stdin}'Saída esperada p/ teste:'\n${results[i].output}\n'Saída do seu programa:'\n${resp_teste.stdout}\n//-----fim da execução------\n\n`

		    	}
		    }
		    console.log(results)
	    	return res.status(200).json({results,info})
    	}
    	catch(err){
    		console.log('-------err------');
    		console.log(Object.getOwnPropertyDescriptors(err))
    		console.log('----------------');
    		return res.status(500).json({err})
    	}

	}
    	
}
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
module.exports = new SubmissionController()
