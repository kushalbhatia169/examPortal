const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const Answer = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,  
            required:[true, "can't be blank"], 
            foreignKey: true,
            index: true, 
            ref: 'user',
            unique: true,
        },
        userAnswers: { 
            type: Array, 
            unique:false, 
            foreignKey: true,
            required:[true, "can't be blank"], 
            index: false 
        },
    },
    { timestamps: true },
)

Answer.plugin(uniqueValidator, {message: `Message is already there.`});
module.exports = mongoose.model('answers', Answer, 'Answers')