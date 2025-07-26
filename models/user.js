const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema= new Schema({
  email:{
    type:String,
    required: true,
  }
})

userSchema.plugin(passportLocalMongoose); //implements username, password and salt automatically
module.exports=mongoose.model("User",userSchema);