require('dotenv').config();

var fs = require('fs');
var https = require('https');
var axios = require('axios');

var PRIVATEKEY = process.env.PRIVATEKEY || '<local_da_chave>';
var FULLCHAIN = process.env.FULLCHAIN || '<local_da_chave>';
var CHAIN = process.env.CHAIN || '<local_da_chave>';





var privateKey  = fs.readFileSync(PRIVATEKEY, 'utf8');
var certificate = fs.readFileSync(FULLCHAIN, 'utf8');
var chain = fs.readFileSync(CHAIN, 'utf8');

var credentials = {key: privateKey, cert: certificate, ca: chain};
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const servers = process.env.SERVERS.split(',');

let cur = 0;



app.get('/vmstatus', async (req, res) => {
    let msg = '';
    for(var i = 0; i < servers.length; ++i) {
	     msg += servers[i];
	try {
    	     const response = await axios.get(servers[i]);
             msg += response.status === 200 ? ': OK' : ': DOWN\n';
             msg += '<br/>'
	} catch(e) {
	     msg += ': DOWN<br/>';
	}
    }
    res.send(msg);
})

app.post('/apiCompiler', (req, res) => {
   
   const options = {
      headers: {
         'Content-Type': 'application/json',	 
      },
      timeout: 10000,
   }
   
   axios.post(`${servers[cur]}/apiCompiler`, req.body, options)
		.then((response) => res.send(response.data))
	        .catch((e) => res.send(e));
   

   cur = (cur + 1) % servers.length;
})


var httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.LOAD_BALANCER_PORT, () => console.log(`https on ${process.env.LOAD_BALANCER_PORT}`));
