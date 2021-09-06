const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile');

module.exports = {

  index(req, res) {

    const jobs = Job.get()
    const profile = Profile.get()

    const updatedJobs = jobs.map((job) => {
      
      // ajustes no job
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress' // define o status do prjeto mediante aos dias para entrega
  
      return { // fazendo desta forma o js pega o objeto dentro do array jobs e acrescenta o "remaining", "status" e "budget" sem precisar recria-lo novamente.
        ...job, //espalha todos os jobs aqui dentro
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"] )
      }
    })
  
    return res.render("index", { jobs: updatedJobs })

  },

  create(req, res) {
    return res.render("job")
  },

  save(req, res) {

    const jobs = Job.get()

    //.push -> esta jogando as informações do "req.body" na constant "jobs"

    // se o "jobs.length" existir atribuir ao ".id" se ñ existir não ir para a proxima condição "||" -> (ou)
    //const lastId = Job.get()[Job.data.length - 1]?.id || 0;

    const lastId = jobs[jobs.length - 1].id;

    //"req.body" -> esta pegando as informações através do POST vindo do form "form-job"
    //"req.boby" = { name: 'Lucas Ramos', 'daily-hours': '2', 'total-hours': '1' }
    jobs.push({
      id: lastId + 1,
      name: req.body.name, 
      "daily-hours": req.body["daily-hours"], 
      "total-hours": req.body["total-hours"],
      created_at: Date.now() // atribuindo data de hoje em milesegundos
    }) 

    //console.log(lastId) 
    return res.redirect('/')
  },

  // - # qd eu clicar no edit do job trazer as informações para a tela "job/edit"# -
  show(req, res) {

    const jobId = req.params.id // pega o id do projeto pelos parametros (url/GET)
    const jobs = Job.get()

    // ".find" -> faz a verificação do até encontrar o id conrrespondente. Se encontrar salva ele no "job"
    const job = jobs.find(job => Number(job.id) === Number(jobId))

    if(!job) { // se ñ encontrar o "id" do job retornar a msg "job nor found!"
      return res.send('Job not found!')
    }

    const profile = Profile.get()

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"] )
    
    //console.log(job)
    return res.render("job-edit", { job })
  },

  update(req, res) {
    const jobId = req.params.id // pega o id do projeto pelos parametros (url/GET)

    const jobs = Job.get()

    // ".find" -> faz a verificação do até encontrar o id conrrespondente. Se encontrar salva ele no "job"
    const job = jobs.find(job => Number(job.id) === Number(jobId))

    if(!job) { // se ñ encontrar o "id" do job retornar a msg "job nor found!"
      return res.send('Job not found!')
    }

    const updatedJob = {
      // pega o "job" e espalha
      ...job, 

      // substitui os valores pelo que foi digitado no corpo (form)
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    }

    const newJobs = jobs.map(job => {

      if(Number(job.id) === Number(jobId)) {
        job = updatedJob
      }

      //console.log(job)
      return job
    })

    Job.update(newJobs)

    res.redirect('/')
  },

  delete(req, res) {
    const jobId = req.params.id
    
    Job.delete(jobId)

    return res.redirect('/')
  },

};