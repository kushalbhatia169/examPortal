const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const Admin = new Schema(
  {
    admin_username: {
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      index: true
    },
    hash: String,
    salt: String,
  },
  { timestamps: true },
)

Admin.plugin(uniqueValidator, {message: ` is already taken.`});
module.exports = mongoose.model('admin', Admin)