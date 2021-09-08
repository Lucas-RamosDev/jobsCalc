
const Database = require('../db/config')

/* // -> a variavel data era utilizado qd ñ tinhamos o banco de dados configurado
let  data = {
  name: "Lucas Ramos",
  avatar: "https://github.com/Lucas-RamosDev.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 75,
};
*/

module.exports = {
  async get() {

    // inicia a comunicação com o db
    const db = await Database() 

    // executa as ações no db
    const data = await db.get(`SELECT * FROM profile`)

    // finaliza a comunicação com o db
    await db.close()

    //console.log(data)
    //return data
    /* - O 'return' abaixo precisou ser dessa forma para "normalizar" os '-' (traços)
        uma vez que no banco de dados foi salvo com "underline".
    */
    return {
      name: data.name,
      avatar: data.avatar,
      "monthly-budget": data.monthly_budget, 
      "days-per-week": data.days_per_week,
      "hours-per-day": data.hours_per_day,
      "vacation-per-year": data.vacation_per_year,
      "value-hour": data.value_hour
    };
  },

  // - Atualizando os dados
  async update(newData) {

    const db = await Database() // inicia a comunicação com o db

    db.run(`UPDATE profile SET 
      name = "${newData.name}",
      avatar = "${newData.avatar}",
      monthly_budget = ${newData["monthly-budget"]},
      days_per_week = ${newData["days-per-week"]},
      hours_per_day = ${newData["hours-per-day"]},
      vacation_per_year = ${newData["vacation-per-year"]} ,
      value_hour = ${newData["value-hour"]}
      `)

    await db.close()

  }
}
