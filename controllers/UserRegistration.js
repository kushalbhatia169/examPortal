
const User = require('../models/User');
const Admin = require('../models/Admin');
// const { Error } = require('mongoose');
const {setPassword} = require('../utils/hashPassword');
class UserRegistration {
  async createUserData(body) {
        const user = new User(body.data);
        const { hash, salt } = await setPassword(body.data.password);
        user.hash = hash;
        user.salt = salt;
        return await user
        .save()
        .then((user) => {
          if(user){
            return user;
          } 
        })
        .catch(error => {
          return new Error(error);
        });
  }
}

module.exports = UserRegistration;