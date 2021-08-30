const express = require("express")
const server = express()
const routes = require("./routes")

// obs: instalar a extenção EJS language //
//Usando template engine
server.set('view engine', 'ejs')

//habilitar arquivos statics
server.use(express.static("public"))

// habilitar/usar o "req.body"
server.use(express.urlencoded({ extended:true }))

//routes
server.use(routes)

server.listen(3000, () => console.log('Server On'))

// IMPORTANTE - para startar o server execute "npm start"