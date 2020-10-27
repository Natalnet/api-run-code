const {c, cpp, node, python, java} = require('compile-run');
const {URL_GPP, URL_GCC, URL_PYTHON} = require('./src/env');
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const LineReader = require('n-readlines');
const trataErroC = require('./src/util/trataErroC');

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
                            //stdin : "4", 
                            //stdin : "7", //overlap src e dest in memcpy, 
                            stdin : "9 dfaasdfhasdkfçjsaçdffaçldjfasflas fasdfas",

                            compilationPath : URL_GPP,
                            compilerArgs : "-lm",
                            stderrLimit : 2000,
                            stdoutLimit : 2000,
                            addressSanitizer : true
                        });
        

    p.then(result => {
        console.log("result");
        console.log(result);//result object
        if(result.debuggerReportFile){
            //console.log(result.debuggerReportFile);
            let errorSumary = trataErroC.getErrorInfo(result.debuggerReportFile, true, result.files);
            console.log("Error Summary");
            console.log(errorSumary.toString());
        }
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });
    await p;
    
}
        

async function testCFiles(){
    let p = c.runFile("./tests/c/errors.c",
    {
        timeout : 3000,
        compileTimeout  : 60000,
        //stdin : "1",
        //stdin : "2",
        //stdin : "3",
        //stdin : "4",
        //stdin : "5",
        //stdin : "6",
        //stdin : "7",
        //stdin : "8",
        //stdin : "9",
        //stdin : "10",
        //stdin : "11",
        stdin : "13",
        compilerPath : URL_GCC,
        compilerArgs : ['-lm'],
        stderrLimit : 2000,
        stdoutLimit : 2000,
        addressSanitizer : true
    });


    p.then(result => {
        console.log("result");
        console.log(result);//result object
        if(result.debuggerReportFile){
            //console.log(result.debuggerReportFile);
            let errorSumary = trataErroC.getErrorInfo(result.debuggerReportFile, true, result.files);
            console.log("Error Summary");
            console.log(errorSumary.toString());
        }
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });
    await p;
}

testCFiles();
//testCPPFiles();