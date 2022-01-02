const User = require('../models/User');
// const { Error } = require('mongoose');
const path = require('path');
const fs = require('fs');
class GetAllUsers {
    async getUsers() {
        return await User.find({}, (err, users) => {
                if (err) {
                return new Error(err);
                }
                if (!users.length) {
                return new Error(`User not found`);
                }
            })
            .then((users)=>{
                const data = [];
                users.map((item)=>{
                    const { username, name } = item;
                    let filePath = path.resolve(__dirname, 'answer', `${username}.json`);
                    try {
                        const answer = fs.readFileSync(filePath, 'utf8');
                        return data.push({
                            name, 
                            answers: answer
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    
                    return item;
                })
                return data;
            })
            .catch(err => {return new Error(err) }) 
    }
}

module.exports = GetAllUsers;