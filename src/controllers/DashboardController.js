
const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {

  async index(req, res) {

    const jobs = Job.get()
    const profile = await Profile.get() // - neste caso precisamos usar "await" pq nosso "get()" virou await (no arquivo ./model/Profile)

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    // total de horas por dia de cada "job" em progresso.
    let jobTotalHours = 0;
  
    const updatedJobs = jobs.map((job) => {
      
      // ajustes no job
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress' // define o status do prjeto mediante aos dias para entrega
  
      // Somando a quantidade de status
      statusCount[status] += 1; // ele verifica qual o status dos jobs e soma mais 1

      // total de horas por dia de cada "job" em progresso.
      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
      
      /* //no exemplo abaixo é a mesma conta da de cima só q da maneira tradicional
      if (status == 'progress') {
        jobTotalHours += Number(job['daily-hours']);
      }
      */

      return { // fazendo desta forma o js pega o objeto dentro do array jobs e acrescenta o "remaining", "status" e "budget" sem precisar recria-lo novamente.
        ...job, //espalha todos os jobs aqui dentro
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"] )
      }
    })
  
    /* Qtd de horas que quero trabalhar 
        MENOS 
      Qtd de hrs/dia de cada Job em "progress" 
    */
    
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", { 
      jobs: updatedJobs, 
      profile: profile, 
      statusCount: statusCount,
      freeHours: freeHours,
    })
  
  }

}

