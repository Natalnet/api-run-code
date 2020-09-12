const {c, cpp, node, python, java} = require('compile-run');
const {URL_GPP, URL_GCC, URL_PYTHON} = require('../src/env')

let p = c.runFile("./tests/test.c",
                    {
                        timeout : 3000,
                        compileTimeout  : 60000,
                        stdin : undefined,
                        compilationPath : URL_GCC,
                        compilerArgs : "-lm"
                    });

p
    .then(result => {
        console.log("result");
        console.log(result);//result object
    })
    .catch(err => {
        console.log("Error!");
        console.log(err);
    });

