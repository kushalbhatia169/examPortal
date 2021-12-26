const User = require('../models/User');
// const { Error } = require('mongoose');

class GetSecurityQuestion {
    async getSecurityQuestion(searchText){
        console.log(searchText);
        return await User.findOne({ username: searchText}, (err, user) => {
                if (err) {
                    return new Error(err);
                }
            })
            .then((user)=>{ 
                if(!user) {
                    return new Error(`Invalid username`);
                }
                return user 
            })
            .catch(err =>{ return new Error(err) }) 
    }
}

module.exports = GetSecurityQuestion;