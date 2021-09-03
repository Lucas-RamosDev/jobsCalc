const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
  name: "Lucas Ramos",
  avatar: "https://github.com/Lucas-RamosDev.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 75
}

const Job = {
  controllers: {
    index(req, res) {

      const updatedJobs = jobs.map((job) => {
        
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress' // define o status do prjeto mediante aos dias para entrega
        const budget = profile["value-hour"] * job["total-hours"] // calc, qts ganha por hora
    
        return { // fazendo desta forma o js pega o objeto dentro do array jobs e acrescenta o "remaining", "status" e "budget" sem precisar recria-lo novamente.
          ...job, //espalha todos os jobs aqui dentro
          remaining,
          status,
          budget
        }
      })
    
      return res.render(views + "index", { jobs: updatedJobs })

    },

  }
}

const jobs = [ 

  { 
    id: 1,
    name: 'Pizzaria Guloso', 
    "daily-hours": 2, 
    "total-hours": 1,
    created_at: Date.now(),
  },

  { 
    id: 2,
    name: 'OneTwo Project', 
    "daily-hours": 3, 
    "total-hours": 47,
    created_at: Date.now(),
  },

]

// Realiza o calculo do tempo de entrega
function remainingDays(jobCalc) {

      // calculo de tempo restante -> total de horas / por qts horas qro trabalhar por dia = total de dias
      const remainingDays = (jobCalc["total-hours"] / jobCalc["daily-hours"]).toFixed()

      const createdDate = new Date(jobCalc.created_at)
      
      // dia do vencimento
      const dueDay = createdDate.getDate() + Number(remainingDays)
  
      // data do vencimento
      const dueDate = createdDate.setDate(dueDay)
  
      const timeDiffInMs = dueDate - Date.now()
      //tranformar millisegundos em dias
      const dayInMs = 1000 * 60 * 60 * 24
      
      // calculo diferença de dias
      const dayDiff = Math.floor(timeDiffInMs / dayInMs) // "Math.floor" arredonda para baixo
  
      return dayDiff // restam "x" dias
}




routes.get('/', Job.controllers.index)


routes.get('/job', (req, res) => res.render(views + "job"))


// -- ROTA JOBS
routes.post('/job', (req, res) => {
  //.push -> esta jogando as informações do "req.body" na constant "jobs"
  
  // se o "jobs.length" existir atribuir ao ".id" se ñ existir não ir para a proxima condição "||" -> (ou)
  //const lastId = jobs[jobs.length - 1]?.id || 1;
  const lastId = 2

  
  //"req.body" -> esta pegando as informações através do POST vindo do form "form-job"
  //"req.boby" = { name: 'Lucas Ramos', 'daily-hours': '2', 'total-hours': '1' }
  jobs.push({
    id: lastId + 1,
    name: req.body.name, 
    "daily-hours": req.body["daily-hours"], 
    "total-hours": req.body["total-hours"],
    created_at: Date.now() // atribuindo data de hoje em milesegundos
  }) 

  //console.log(jobId) 
  return res.redirect('/')
  
})

routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))

routes.get('/profile', (req, res) => res.render(views + "profile", { profile: profile }))

module.exports = routes;