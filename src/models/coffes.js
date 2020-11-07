let mongoose = require('mongoose')
let Schema = mongoose.Schema
const usersSchema = new Schema({
    Nombre:String,
    Ubicacion:String,
    Coordenadas:String,
    Telefono:String,
    Correo:String,
  },{ collection: "coffes" });

  let Coffe =  mongoose.model('coffes', usersSchema,"coffes");
  module.exports=Coffe;