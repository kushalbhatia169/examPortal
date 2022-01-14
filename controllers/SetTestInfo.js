
const TestInfo = require('../models/TestInfo');
// const { Error } = require('mongoose');

class SetTestInfo {
  async createTestInfo(body) {
    return await TestInfo.deleteMany({ }, (err, user) => {
        if (err) {
            return new Error(err);
        }
        if (!user) {
            return new Error(`User not found`);
        }
    })
    .then(async() => {
        console.log(body)
        const testInfo = new TestInfo(body);
        return await testInfo
            .save()
            .then((tinfo) => {
            if(tinfo){
                return tinfo;
            } 
            })
            .catch(error => {
                return new Error(error);
            });
    })
    .catch(err => { return new Error(err) });
  }
}

module.exports = SetTestInfo;