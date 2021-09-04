const express = require('express');
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {

  data: {
    name: "Lucas Ramos",
    avatar: "https://github.com/Lucas-RamosDev.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
  },

  controllers: {

    // - # exibe os dados do meu perfil # -
    index(req, res) {
      return res.render(views + "profile", { profile: Profile.data })
    },

    // - # calculo para descobrir o valor da hora # -
    update(req, res) {
      // req.body para pegar os dados
      const data = req.body

      // definir qts semanas tem no ano: 52sem
      const weeksPerYears = 52

      // remover as semanas de ferias do ano, para pegar qts semanas tem em 1 mês
      const weeksPerMonth = (weeksPerYears - data["vacation-per-year"] ) / 12

      // total de horas trabalhadas na semana
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

      // total de horas trabalhadas no mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      // qual será o valor da minha hora
      const valueHour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour
      }

      return res.redirect('/profile')

    }


  }

}

const Job = {

  data: [ 

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
  
  ],

  controllers: {
    index(req, res) {

      const updatedJobs = Job.data.map((job) => {
        
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress' // define o status do prjeto mediante aos dias para entrega
        const budget = Profile.data["value-hour"] * job["total-hours"] // calc, qts ganha por hora
    
        return { // fazendo desta forma o js pega o objeto dentro do array jobs e acrescenta o "remaining", "status" e "budget" sem precisar recria-lo novamente.
          ...job, //espalha todos os jobs aqui dentro
          remaining,
          status,
          budget
        }
      })
    
      return res.render(views + "index", { jobs: updatedJobs })

    },

    create(req, res) {
      return res.render(views + "job")
    },

    save(req, res) {
      //.push -> esta jogando as informações do "req.body" na constant "jobs"
  
      // se o "jobs.length" existir atribuir ao ".id" se ñ existir não ir para a proxima condição "||" -> (ou)
      //const lastId = Job.data[Job.data.length - 1]?.id || 1;
      const lastId = 2

      //"req.body" -> esta pegando as informações através do POST vindo do form "form-job"
      //"req.boby" = { name: 'Lucas Ramos', 'daily-hours': '2', 'total-hours': '1' }
      Job.data.push({
        id: lastId + 1,
        name: req.body.name, 
        "daily-hours": req.body["daily-hours"], 
        "total-hours": req.body["total-hours"],
        created_at: Date.now() // atribuindo data de hoje em milesegundos
      }) 

      //console.log(jobId) 
      return res.redirect('/')
    },

    // - # qd eu clicar no edit do jog trazer as informações para a tela "job/edit"# -
    show(req, res) {

      

      return res.render(views + "job-edit", { job })
    },

  },


  services: {

    // Realiza o calculo do tempo de entrega
    remainingDays(jobCalc) {

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
  }


}

routes.get('/', Job.controllers.index)


routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)


routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;