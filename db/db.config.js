require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
    DBSERVICE: 'mongodb+srv',
    DBAddress: 'mongodb+srv://admin:Kush8127@cluster0.m8ihh.mongodb.net/onlinePortel?retryWrites=true&w=majority',
    DBPARAMS: {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false,
    }
}
