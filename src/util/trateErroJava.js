const LineReader = require('n-readlines');
const STDERR_LIMIT = process.env.STDERR_LIMIT;

function getErrorInfo(erro, verbose){ //limpa o nome do arquivo para evitar confusão
 
    linhas = erro.split('\n');
    for(idx in linhas){
        let linha = linhas[idx];
        if(verbose)
            console.log(`processando linha ${linha}`)
        let cleanError = linha.substring(linha.lastIndexOf("/")+1);
        if(verbose)
            console.log(`erro após processamento ${cleanError}`);
        linhas[idx] = cleanError;

    }
    return linhas.join('\n');
}

module.exports ={
    getErrorInfo
}
