const User = require('../models/User');
const Answer = require('../models/Answer');
const { isEmpty } = require('lodash');
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
            .then(async(users)=>{
                const data = [];
                const promises = await Promise.allSettled(users.map(async (item)=>{
                    const { _id } = item;
                    try {
                        return await Answer.find({userId: _id})
                            .populate('userId') // multiple path names in one requires mongoose >= 3.6
                            .then((answers) => {
                                //!isEmpty(answers) && console.log(answers)
                                console.log(_id.equals(answers[0]?.userId?._id))
                                if(_id.equals(answers[0]?.userId?._id)) {
                                    !isEmpty(answers) && data.push(...answers);
                                    return data; // return the array of answers
                                }
                            })
                            .catch(err => {
                                return new Error(err);
                            });
                       
                    } 
                    catch (error) {
                        return new Error(error);
                    }
                }));
                console.log(promises)
                return promises;
            })
            .catch(err => {return new Error(err) }) 
    }
}

module.exports = GetAllUsers;