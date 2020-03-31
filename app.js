var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/exec.lop.ect.ufrn.br/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/exec.lop.ect.ufrn.br/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express();

//middlewares globais
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//rotas
require('./routes')(app)

var httpsServer = https.createServer(credentials, app);

var httpServer = http.createServer(app);
//httpServer.listen(3001, () => console.log('http on 3001'));

httpsServer.listen(443, () => console.log('https on 443'));
