const {c, cpp, node, python, java} = require('compile-run');
const {URL_GPP, URL_GCC, URL_PYTHON} = require('./src/env');
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

function processStack(stackFrames, programObj){
    let stackTrace = [];
    firstFrame = stackFrames[0]; //analisa apenas o primeiro frame
    for(let i=0; i < firstFrame.frame.length; i++){
        //console.log(frame_e.frame[i].obj[0]);
        //console.log(programObj);
        
        if(firstFrame.frame[i].obj[0] === programObj){ //only consider entries that have an associated file, thus it will ignore std libs entries
            stackTrace.push(`${firstFrame.frame[i].fn}:${firstFrame.frame[i].line}`);
        }
    }  
    return stackTrace;
}

/*
* recebe um elemento fatal_signal do valgrind e retorna uma lista com posições no código
* no formato signame : {stack : [funcao:linha, ...]}
* signame é o nome do signal recebido 'SIGINT', etc
* para um vetor com o stack até a função main é retornado. O stack vai da função mais interna para a mais externa
*/
function processFatalSignal(fatal_signal, programObj){
    console.log(fatal_signal.signame);
    let stackTrace = processStack(fatal_signal.stack, programObj);
    console.log(stackTrace);
}

/*
* recebe uma lista de erros do valgrind e retorna uma lista com posições no código
* no formato erro : {stack : [funcao:linha, ...]}
* erro pode ser InvalidWrite ou InvalidRead
* para cada erro um vetor com o stack até a função main é retornado. O stack vai da função mais interna para a mais externa
*/
function processErrors(errors, programObj){
    let errorSet = new Set();
    errors.forEach(error => {
        if(error.kind == 'InvalidWrite'){ //add invalid read
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
        }
        else if(error.kind == 'InvalidRead'){
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
        }
        else if(error.kind == 'UninitValue'){
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {}
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
            //console.log(stackTrace);
        }
        else if(error.kind == 'UninitCondition'){
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
            //console.log(stackTrace);
        }
        else if(error.kind == 'Leak_DefinitelyLost'){
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
        }
        else if(error.kind == 'MismatchedFree'){ //new > free ao invés de delete || new > delete ao invés de delte[]
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
        }
        else if(error.kind == 'InvalidFree'){
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};
            errorSet.add(JSON.stringify(errorEntry));
        }
        else if(error.kind == 'SyscallParam'){
            processStack(error.stack, programObj);
            let stackTrace = processStack(error.stack, programObj);
            let errorEntry = {};
            errorEntry[error.kind] = {'stack' : stackTrace, 'what' : error.what};

            errorSet.add(JSON.stringify(errorEntry));
        }

    });
    console.log(errorSet);
}


function getErrors(debugReportFile, verbose){
    //let error = {memory : {}};
    const xml = fs.readFileSync(debugReportFile);

    // convert XML to JSON
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
            if (err) {
                throw err;
            }
            if(verbose = true)
                console.log(util.inspect(result, {colors:true, depth:10}));
            
            var programObj = result.valgrindoutput.args[0].argv[0].exe[0];
            console.log(programObj);
            
            var fatal_signal = result.valgrindoutput.fatal_signal;
            if(fatal_signal){
                processFatalSignal(fatal_signal[0]);
            }
            var errors = result.valgrindoutput.error;
            if(errors){ //mermory related errors
                processErrors(errors, programObj);
            }
            
            //errs = getErrors(result);
            
            //console.log(util.inspect(result, {depth:Infinity, colors:true}));
    });

}

async function testCPPFiles(){
    /*testa os erros atualmente suportados pela saída com debugger.
    */
    let p = cpp.runFile("./tests/cpp/valgrind.cpp",
                        {
                            timeout : 3000,
                            compileTimeout  : 60000,
                            //stdin : "1",
                            //stdin : "2",
                            //stdin : "3",
                            //stdin : "4", //não mostrou erros
                            stdin : "7", //overlap src e dest in memcpy, nao gerou erro!
                            //stdin : "9 dfaasdfhasdkfçjsaçdffaçldjfasflas fasdfas",

                            compilationPath : URL_GPP,
                            compilerArgs : "-lm",
                            stderrLimit : 2000,
                            stdoutLimit : 2000,
                            debugger : true
                        });
        

    p.then(result => {
        console.log("result");
        console.log(result);//result object
        if(result.debuggerReportFile){
            getErrors(result.debuggerReportFile, false);
        }
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });
    await p;
    
}
        

async function testCFiles(){
    let p = c.runFile("./tests/c/test2.c",
    {
        timeout : 3000,
        compileTimeout  : 60000,
        stdin : "3",  
        compilationPath : URL_GCC,
        compilerArgs : "-lm",
        stderrLimit : 2000,
        stdoutLimit : 2000,
        debugger : true
    });


    p.then(result => {
        console.log("result");
        console.log(result);//result object
        if(result.debuggerReportFile){
            getErrors(result.debuggerReportFile);
        }
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });
    await p;
}

//testCFiles();
testCPPFiles();