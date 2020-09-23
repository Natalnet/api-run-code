const {c, cpp, node, python, java} = require('compile-run')
const trataCodigoJS = require('../util/trataCodigoJS')
const todosIguais = require('../util/todosIguais')
const trataErroCPP = require('../util/trataErroCPP')
const trataErroJS = require('../util/trataErroJS')
const {URL_GPP, URL_GCC, URL_PYTHON, STDERR_LIMIT, STDOUT_LIMIT} = require('../env')

class SubmissionController{
    async exec(req,res){
    	try{
    		//const begin = new Date()

			let { codigo,linguagem,results } = req.body;
			let totalTestes = results.length
			let totalCertas =0
    		const timeout = process.env.TIME_OUT || 3000
		    let resp_testes=[]
		    let algumErro= false;
		    let erro =''  
			let descriptionErro = ''
			
			//execuções assíncronas
			//return res.status(500).json({msg:''})

		    resp_testes = await Promise.all(results.map((result,i)=>{
		    	if(linguagem==='javascript'){
					return node.runSource(trataCodigoJS(codigo,result.inputs),{
				    	timeout : timeout,
						stdin   : result.inputs,
						stdoutLimit : STDOUT_LIMIT,
						stderrLimit : STDERR_LIMIT
				    });
				}
		    	else if(linguagem==='cpp'){
			    	return cpp.runSource(codigo,{
				    	timeout         : timeout,
				    	compileTimeout  : 60000,
				    	stdin           : result.inputs || undefined,
						compilationPath : URL_GPP,
						stdoutLimit : STDOUT_LIMIT,
						stderrLimit : STDERR_LIMIT
				    });
				}
				else if(linguagem==='c'){
			    	return c.runSource(codigo,{
						timeout         : timeout,
						compileTimeout  : 60000,
						stdin           : result.inputs || undefined,
						compilationPath : URL_GCC,
						compilerArgs : "-lm",
						stdoutLimit : STDOUT_LIMIT,
						stderrLimit : STDERR_LIMIT
					});
		    	}
		    	else if(linguagem==='python'){
			    	return python.runSource(codigo,{
						timeout        : timeout,
						executionPath  : URL_PYTHON,
						stdin          : result.inputs,
						stdoutLimit : STDOUT_LIMIT,
						stderrLimit : STDERR_LIMIT
				    });
		    	}
		    }))
		    

		    //execuções síncronas
		    /*for(let result of  results){
		    	if(linguagem==='javascript'){
		    		//Implementa as funções prompt e alert ao codigo Javascript
		    		const codigoJsTratado = trataCodigoJS(codigo,result.inputs)
		    		resp_testes = [...resp_testes,await node.runSource(codigoJsTratado,{
				    	timeout         : timeout,
				    	stdin           :result.inputs,
				    })]	   	    		
		    		//trataErro js
		    		//erro = resp_teste.stderr?trataErroJS(resp_teste.stderr):''
		    	}
		    	else if(linguagem ==='cpp'){
		    		resp_testes = [...resp_testes,await cpp.runSource(codigo,{
				    	timeout         : timeout,
				    	compileTimeout  : 60000,
				    	stdin           : result.inputs,
				    	compilationPath : URL_GCC
				    })]
		    	}
		    }*/

		    results = resp_testes.map((resp_teste,i)=>{
		    	const result={}
		    	result.inputs = results[i].inputs
		    	//retira todos caracteres especiais '\r'
		    	result.saidaResposta = resp_teste.stdout?resp_teste.stdout.split('\r').join(''):''
				//retira todos espaçoes vazios do lado direito de cada linha do código
				result.saidaResposta = result.saidaResposta.split('\n').map(row=>row.replace(/\s+$/,'')).join('\n')
				result.output = results[i].output.split('\n').map(row=>row.replace(/\s+$/,'')).join('\n')
		    	//retira os caractere especiais '\n' do final do código'
				result.saidaResposta = result.saidaResposta.replace(/\n+$/,'')
				result.output = result.output.replace(/\n+$/,'')
		    	if(linguagem==='javascript'){
		    		erro = resp_teste.stderr?trataErroJS(resp_teste.stderr):''
		    	}
		    	else if(linguagem==='cpp' || linguagem==='c'){
		    		erro = resp_teste.stderr?trataErroCPP(resp_teste.stderr):''
		    	}
		    	else if(linguagem==='python'){
		    		erro = resp_teste.stderr || ''
		    	}
		
		    	if(erro || resp_teste.errorType){
					//console.log("error type " + erro + ", " + resp_teste.errorType );
					algumErro = true
			    	result.stderr = erro;
			    	result.errorType = resp_teste.errorType;
			    	result.exitCode = resp_teste.exitCode;
			    	result.memoryUsage = resp_teste.memoryUsage;
			    	result.cpuUsage = resp_teste.cpuUsage;
					result.errorType = resp_teste.errorType || '';
					result.descriptionErro = `${result.stderr && result.stderr+'\n'}errorType: ${result.errorType}`
		    	}
		    	//verifica se a saída de teste bateu com a saída do programa
				result.isMatch = (result.output === result.saidaResposta) && !(result.descriptionErro);
		    	totalCertas = result.isMatch? totalCertas + 1: totalCertas
		    	return result
			})
			//console.log('results: ',results);

		    const percentualAcerto = (totalCertas/totalTestes*100).toFixed(2)
			//verifica se todos os erros são iguais, para mostrar só um erro e não o mesmo erro para cada caso de teste
			descriptionErro = algumErro && todosIguais(results.map(result=>result.descriptionErro))?results[0].descriptionErro:false
	    	return res.status(200).json({results,percentualAcerto,descriptionErro});
    	}
    	catch(err){
    		console.log('-------err------');
    		console.log(err);
    		console.log('----------------');
    		return res.status(500).json({err});
    	}

	}

    
    	
}
module.exports = new SubmissionController();
