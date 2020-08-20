require("dotenv/config")
var fs = require('fs');
var http = require('http');

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

var httpServer = http.createServer(app);

httpServer.listen(3003, () => console.log('https on 3003'));
