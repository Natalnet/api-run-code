var fs = require('fs');
var https = require('https');
var axios = require('axios');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/exec.lop.ect.ufrn.br/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/exec.lop.ect.ufrn.br/fullchain.pem', 'utf8');
var chain = fs.readFileSync('/etc/letsencrypt/live/exec.lop.ect.ufrn.br/chain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate, ca: chain};
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const servers = [
	'https://exec.lop.ect.ufrn.br:3003',
	'https://exec.lop.ect.ufrn.br:3003',
	'https://lop.ect.ufrn.br:3003',
];
let cur = 0;



app.post('/apiCompiler', async (req, res) => {
   
   const options = {
      headers: {
         'Content-Type': 'application/json',	 
      }
   }

   const response = await axios.post(`${servers[cur]}/apiCompiler`, req.body, options);

   cur = (cur + 1) % servers.length;

   res.send(response.data);
})


var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => console.log('https on 443'));
