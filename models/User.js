const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const User = new Schema(
  {
    phoneNumber: { 
      type: Number, 
      required: true, 
      unique:true, 
      required:[true, "can't be blank"], 
      match: [/^[0-9]+$/, 'is invalid'], 
      index: true 
    },
    username: {
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      unique:true, 
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      index: true
    },
    name: {
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      // match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      // index: true
    },
    email: {
      type: String, 
      lowercase: true, 
      unique:true ,
      required: [true, "can't be blank"], 
      match: [/\S+@\S+\.\S+/, 'is invalid'], 
      index: true
    },
    father_name:{
      type: String, 
      lowercase: true,
      required: [true, "can't be blank"], 
      // match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      index: false
    },
    address:{
      type: String, 
      lowercase: true,
      required: [true, "can't be blank"], 
      index: false
    },
    security_question:{
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      index: false
    },
    security_answer:{
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      index: false
    },
    course:{
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      index: false
    },
    age:{
      type: Number, 
      required: [true, "can't be blank"], 
      index: false
    },
    admin:{
      type: Boolean, 
      required: [true, "can't be blank"], 
      index: false
    },
    hash: String,
    salt: String,
  },
  { timestamps: true },
)

User.plugin(uniqueValidator, {message: `is already taken.`});
module.exports = mongoose.model('user', User)