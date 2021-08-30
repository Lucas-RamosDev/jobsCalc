const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
  name: "Lucas Ramos",
  avatar: "https://github.com/Lucas-RamosDev.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4
}


const jobs = [ ]


//req, res (pedidos e respostas)
routes.get('/', (req, res) => res.render(views + "index"))

routes.get('/job', (req, res) => res.render(views + "job"))

// -- ROTA JOBS
routes.post('/job', (req, res) => {
  //.push -> esta jogando as informações do "req.body" na constant "jobs"
  //"req.body" -> esta pegando as informações através do POST vindo do form "form-job"
  jobs.push(req.body)
  //console.log(jobs)
  return res.redirect('/')
  
})

routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))

routes.get('/profile', (req, res) => res.render(views + "profile", { profile: profile }))

module.exports = routes;