const util = require('util');
const LineReader = require('n-readlines');
const {STDERR_LIMIT} = require('../env')

function getStack(lineReader, files){
    let stack = "";

    let fileNames = [];
    
    files.forEach(element => {
        let vec = element.split('/');
        element = vec[vec.length - 1]; //pega apenas o nome do arquivo
        fileNames.push(vec[vec.length - 1]);
    });


    /*stack trace
      formato #0 0x4c3e65 in test_13 /...././tests/c/errors.c:155:12
              ^^             ^^^^^^^                          ^^^^^^
    */
    let stack_count = 0;
    while (line = lineReader.next()) {
        let line_text = line.toString('ascii');
        //console.log(line_text + '\n' + filesRegex);
        
        //apenas conta stacks que tenham os nomes dos arquivos compilados, 
        //excluindo assim os binários gerados na compilaçao
        if(/.*#\d+.*/.test(line_text) && line_text.search(fileNames[0]) != -1){
            let stackNumber = `#${stack_count++}` ;
        
            let function_ = /in \w+/.exec(line_text);
            if(!function_) //sometimes there is only function addresses
                continue;
            else{
                function_ = function_.toString().slice(3); //remove o 'in '

                //console.log("stack found " + file_name);
                let line_info = /:\d+/.exec(line_text);

                //console.log("stack found " + `${stackNumber} ${function_}${line_info}`);
                stack += `${stackNumber} ${function_}${line_info}\n`;
            }
            
            if(function_ == 'main')
                break;
        }
    }
    return stack;
}

function getErrorInfo(debugReportFile, verbose, files){
    let lines = new LineReader(debugReportFile);

    let line;
    let summary = '';  //resumo do erro
 
    if (verbose){  
        while (line = lines.next()) {
            let line_text = line.toString('ascii');
            if(verbose)
                console.log(line_text);
        }
        console.log("Processing Error!");
        lines = new LineReader(debugReportFile);
    }
        
    while (line = lines.next()) {
        let line_text = line.toString('ascii');
        if(verbose)
            console.log(line_text);

        /*primeira parte
            formato ==9711==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000 (pc 0x0000004c3e65 bp 0x7fff25db6a30 sp 0x7fff25db6a20 T0)
                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        */
        if(/.*==ERROR: AddressSanitizer:*/.test(line_text)){ //address Sanitizer errors
            let error = /ERROR: AddressSanitizer:.*on/.exec(line_text); //alguns erros tem "on" outros não, então testo primeiro se tem on
            if(error)
                error = `${error.toString().slice(0,-3)}`; //remove o 'on'
            else{
                error = /ERROR: AddressSanitizer:.*:/.exec(line_text);
                error = `${error.toString().slice(0,-1)}`; //remove o ':'
            }
            summary += `${error}\n`;
            summary += getStack(lines, files);
        }
        else if(/.*==ERROR: LeakSanitizer/.test(line_text)){ //leak Sanitizer errors
            let error = /ERROR: LeakSanitizer:.*/.exec(line_text);
            summary += `${error.toString()}\n`;
            summary += getStack(lines, files);
        }
        
    }
    
    return summary;

}

module.exports ={
    getErrorInfo
}