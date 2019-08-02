const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

//middlewares globais
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//rotas
require('./routes')(app)
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`listen on port ${PORT}`)
})