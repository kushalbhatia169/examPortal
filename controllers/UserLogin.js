const User = require('../models/User');
const TestInfo = require('../models/TestInfo');
const {generateJWT} = require('../utils/Jwt');
const {validateHashPassword} = require('../utils/hashPassword');

class UserLogin {   
  async aunthenticateUser(username, password) {
    return await User.findOne({username: username}, (err) => {
        //console.log(user)
        if (err) {
          // return res.status(400).json({ success: false, error: err })
          return new Error(err)
        }
      })
      .then((user)=> {
        if(!user) {
          return new Error(`user not found`);
        }
        return (async() => {
          const testInfo = new TestInfo();
          const isPasswordValid = await validateHashPassword(password, user?.salt, user?.hash);
          if(!isPasswordValid) return new Error('incorrect user/password');
          const jwToken = await generateJWT(user);
          const result = {};
          result["x-auth-token"] = jwToken;
          result["user"] = user;
          return await TestInfo.find({}, err => {
            if(err) {
              return new Error(err);
            };
          })
          .then((tinfo)=>{
            result["testInfo"] = tinfo;
            return result;
          })
          .catch(err => {
            return new Error(err);
          });
          //return result;
        })();
      })
      .catch((e)=>{
        return new Error(e.message);
      })
  }
}
  
module.exports = UserLogin;