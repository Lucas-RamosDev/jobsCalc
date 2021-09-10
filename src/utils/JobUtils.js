
module.exports = {

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
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs) // "Math.ceil" arredonda para cima

    return dayDiff // restam "x" dias
  },

  // Calcula quantos quero ganhar por hora
  calculateBudget: (job, valueHour) =>  valueHour * job["total-hours"]
}

