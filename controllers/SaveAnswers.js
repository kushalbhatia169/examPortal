const mongoose = require('mongoose');
const User = require('../models/User');
const Answer = require('../models/Answer');

class SaveAnswers {
    async saveAnswers(userId, answers) {
        const answer = {};
        answer.userId = userId;
        answer.userAnswers = [...answers];
        return await Answer.findOneAndUpdate({userId: userId},
            answer, { upsert: true }, (err) =>{
                // Deal with the response data/error
                if(err) {
                    return new Error(err);
                }
            })
            .then(()=>{
                console.log('Message saved');
                return 'Message saved';
            })
            .catch((e)=>{
                console.log(e)
                return new Error(e);
            });
    }
}

module.exports = SaveAnswers;
