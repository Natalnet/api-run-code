const route = require('express').Router()
const SubmissionController = require('./src/controllers/submissionController')

route.post('/apiCompiler',SubmissionController.exec);
/*
    recebe no body
    linguagem -> linguagem do código (cpp,javascrpt)
    codigo -> todo o conteúdo que está dentro do editor
    results -> um array de objetos com a seguintes propriedades
        inputs -> uma string definindo a(s) entradas(cada valor separado por um \n)
        output -> uma string definindo a saída esperada do respectivo teste

     retorno
     percentualAcerto -> percentual de acerto (0.00 - 100.00)
     descriptionErro -> virá a descrição do erro caso tenha acontecido o mesmo
        erro para todos os casos de teses (geralmente erro de copilaçõ ou execução),
        caso não tenha o mesmo erro pra todos os testes, será retornado false
    results -> um array de objetos com as seguintes propiedades (basicamente o mesmo results
        da entrada, só que com duas propriedades a mais)
        inputs -> uma string definindo a(s) entradas(cada valor separado por um \n)
        output -> uma string definindo a saída esperada do respectivo teste
        saidaResposta -> a saída do programa compilado
        isMatch -> true caso a saidaResposta bateu com output, falso caso contrário
    
        (obs) caso tenha havida erro no código, virá algumas propriedades a mais
        stderr, errorType, exitCode, memoryUsage, cpuUsage, descriptionErro

*/

module.exports = (app) => app.use(route)
