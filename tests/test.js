const {c, cpp, node, python, java} = require('compile-run');
const {URL_GPP, URL_GCC, URL_PYTHON} = require('../src/env')

//let p = c.runFile("./tests/c/test.c",
let p = node.runFile("./tests/js/test.js",
                    {
                        timeout : 3000,
                        compileTimeout  : 60000,
                        stdin : "10 10 20",  
                        compilationPath : URL_GCC,
                        compilerArgs : "-lm",
                        stderrLimit : 2000,
                        stdoutLimit : 2000
                    });

p
    .then(result => {
        console.log("result");
       // console.log(result);//result object
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });

