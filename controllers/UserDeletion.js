const User = require('../models/User');
// const { Error } = require('mongoose');
class UserDeletion {
    async deleteUser (id) {
        console.log(id)
        return await User.findOneAndDelete({ _id: id }, (err, user) => {
                if (err) {
                    return new Error(err);
                }
                if (!user) {
                    return new Error(`User not found`);
                }
            })
            .then(() => { return 'User Deleted' })
            .catch(err => { return new Error(err) });
    }
}
  
module.exports = UserDeletion;