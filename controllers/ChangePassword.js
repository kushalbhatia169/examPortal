const User = require('../models/User');
const {setPassword} = require('../utils/hashPassword');

class ChangePassword {
    async changePassword(body){
        return await User.findOne({ username: body.username }, async(err, user) => {
                if (err) {
                    return new Error(err)
                }
            })
            .then((user) => {
                return (async()=>{
                    if(!user) {
                        return new Error(`Invalid username`);
                    }
                    else {
                        console.log(user?.security_answer, body?.security_answer)
                        if(user?.security_answer?.toLowerCase() === body?.security_answer?.toLowerCase() ) {
                            const { hash, salt } = await setPassword(body.password);
                            user.hash = hash;
                            user.salt = salt;
                            return user
                                .save()
                                .then((user) => {
                                    if(!user) {
                                        return new Error(`user not found`);
                                    }
                                    console
                                    return user;
                                })
                                .catch(error => {
                                    return new Error(error);
                                })
                        }
                        else {
                            return new Error(`Invalid security answer`);
                        }
                    }
                })();
            })
            .catch(err => {
                console.log(err)
                return new Error(err)
            }) 
    }
}

module.exports = ChangePassword;