let mongoose = require('mongoose')
let Schema = mongoose.Schema
const usersSchema = new Schema({
    usuario:String,
    correo:String,
    password:String,
  },{ collection: "users" });

  let Usuario =  mongoose.model('users', usersSchema,"users");
  module.exports=Usuario;