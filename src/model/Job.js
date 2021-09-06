
let data = [ 

  { 
    id: 1,
    name: 'Pizzaria Guloso', 
    "daily-hours": 1, 
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

];

module.exports = {
  get() { // pega os dados
    return data
  },

  update(newJob) {
    data = newJob
  },

  delete(id) {

    // Filter -> vai filtrar o array, e vai procurar algo para tirar.
    data = data.filter(job => Number(job.id) !== Number(id))

  }

}