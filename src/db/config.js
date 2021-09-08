const sqlite3 = require('sqlite3')
const { open } = require('sqlite') // "open" -> abre a conexão com meu banco de dados

module.exports = () => 
  open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });