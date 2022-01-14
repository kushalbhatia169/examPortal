const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const TestInfo = new Schema(
  {
    TestName: {
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      index: true
    },
    TestTime:{
      type: Number, 
      required: [true, "can't be blank"], 
    },
  },
  { timestamps: true },
)

TestInfo.plugin(uniqueValidator, {testInfo: `is already taken.`});
module.exports = mongoose.model('testInfo', TestInfo)