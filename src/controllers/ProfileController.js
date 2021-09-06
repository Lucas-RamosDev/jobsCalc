const Profile = require('../model/Profile')

module.exports = {

  // - # exibe os dados do meu perfil # -
  index(req, res) {

    return res.render("profile", { profile: Profile.get() })
    
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

    Profile.update({
      ...Profile.get(),
      ...req.body,
      "value-hour": valueHour
    }) 

    return res.redirect('/profile')

  }

}