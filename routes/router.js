const express = require('express')
const { isEmpty } = require('lodash');
const multer  = require('multer')
const path = require('path');
const UserRegistration = require('../controllers/UserRegistration');
const UserLogin = require('../controllers/UserLogin');
const GetAllUsers = require('../controllers/GetAllUsers');
const SetTestInfo = require('../controllers/SetTestInfo');
const SaveAnswers = require('../controllers/SaveAnswers');
const UserDeletion = require('../controllers/UserDeletion');
const csv = require('csvtojson');
const middleware = require("../middlewares");
const GetSecurityQuestion = require('../controllers/GetSecurityQuestion');
const ChangePassword = require('../controllers/ChangePassword');
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, 'paper'));
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

        // You could use the original name
        cb(null, 'mkl.csv');
    }
});

const upload = multer({storage: storage});
let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

router.post('/register', async (req, res) => {
    const userRegistration = new UserRegistration();
    const body = req.body;
    try {
        const status = await userRegistration.createUserData(body);
        if(status instanceof Error) {
            console.log(status);
            return res.status(200).json({
                success: false,
                message: status.message,
          })
        }
      
        return res.status(201).json({
            success: true,
            data: {...status}, 
            message: 'User created successfully!',
        })
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

router.get('/login', middleware.isAuthenticated, async(req, res) => {
    const userLogin = new UserLogin();
    const status = await userLogin.aunthenticateUser(req.username, req.password);
    try {
        if(status instanceof Error) {
            return res.status(200).json({
                success: false,
                message: status.message,
            })
        }
        if(status){
            const {_id, username, name, phoneNumber, email, father_name, address, age, course } = status.user;
            res.cookie("jwt", status["x-auth-token"], {
                secure: false,
                httpOnly: true,
            }); 
         
            return res.status(200).json({ 
                success: true, 
                message:"User logged in", 
                data: {_id, username, name, phoneNumber, email, father_name, address , age,
                    course, jwt: status["x-auth-token"], testInfo: status.testInfo}
            })
        }
        else {
            throw Error;
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
});

router.post('/getSecurityQuestion', async(req, res)=> {
    const getUser = new GetSecurityQuestion();
    try {
        const status = await getUser.getSecurityQuestion(req.body.username);
        if(status instanceof Error) {
            console.log(status)
            return res.status(200).json({
                status: false,
                message: status.message,
            });
        }
        if(status) {
            const {security_question, username} = status;
            //await sendEmail(status.email, "Otp sent from online portal", otp);
            return res.status(201).json({
                success: true,
                data: { security_question, username },
            })
        }
        else throw Error;
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

router.put('/changePassword', async(req, res)=>{
    const passwordChange = new ChangePassword();
    try {
        const status = await passwordChange.changePassword(req.body);
        if(status instanceof Error) {
            return res.status(200).json({
                success: false,
                message:  status.message,
            })
        }
        if(status){
            return res.status(201).json({
                success: true,
                message: 'Password updated!',
            })
        }
        else {
            throw Error;
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

router.post('/getExam', middleware.isAuthorized, async (_req, res) => {
    const csvFilePath = path.resolve(__dirname, 'paper', 'mkl.csv');
    //const csvFilePath = path.resolve(__dirname, '..', 'paper', 'mkl.csv');
    const date = new Date().getTime();
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        return res.status(201).json({
            success: true,
            data: jsonObj,
            timeStamp: date,
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    });
});

router.post('/submitExam', middleware.isAuthorized, async (req, res) => {
    try {
        const { userId, answers, examTime, examEndTime, testTime } = req.body;
        if(examTime) {
            const totalExamTime = examEndTime - examTime;
            const totalTime = totalExamTime / 1000;
            const minutes = Math.floor(totalTime / 60);
            if(minutes > testTime) {
                return res.status(200).json({
                    success: false,
                    message: 'Exam time exceeded!',
                });
            }
            else {
                const saveAnswers =  new SaveAnswers();
                const status = await saveAnswers.saveAnswers(userId, answers);
                try {
                    if(status instanceof Error) {
                        return res.status(200).json({
                            success: false,
                            message: status.message,
                        })
                    }
                    if(status) {
                        return res.status(201).json({
                            success: true,
                            message: 'Exam submitted successfully!',
                        })
                    }
                    else {
                        throw Error;
                    }
                } 
                catch (error) {
                    console.log(error)
                    return res.status(400).json({
                        success: false,
                        error,
                        message: error.message,
                    })
                };
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error,
            message: 'Exam not submitted!',
        }) 
    }
});

router.post('/uploadFile', upload.single('mkl') ,  middleware.isAuthorized, async(req, res) => {
    return res.json({
        success: true,
    });
});

router.get('/getAnswers', middleware.isAuthorized, async (req, res) => {
    const getAllUsers = new GetAllUsers;
    try {
        const status = await getAllUsers.getUsers(); 
        if(status instanceof Error || isEmpty(status)) {
            console.log(status)
            return res.status(200).json({
                status: false,
                message: status?.message,
            });
        }
        if(status) {
            const res_data = [];
            !isEmpty(status[0]?.value) && status[0]?.value?.map(user => {
                console.log(user)
                    const { userAnswers, userId } = user;
                    console.log(userId?.username)
                    return res_data.push({
                        userAnswers : userAnswers,
                        userId: userId?._id,
                        email : userId?.email,
                        father_name : userId?.father_name,
                        phoneNumber : userId?.phoneNumber,
                        username : userId?.username,
                        name : userId?.name,
                    });
                // } 
            });
            return res.status(201).json({
                success: true,
                data: [...res_data],
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.message,
        })
    }
});

router.put('/setTestInfo', middleware.isAuthorized, async (req, res) => {
    const testInfo = new SetTestInfo;
    try {
        const status = await testInfo.createTestInfo(req.body);
        if(status instanceof Error) {
            return res.status(200).json({
                status: false,
                message: status.message,
            });
        }
        if(status) {
            return res.status(201).json({
                success: true,
                message: 'Test info updated!',
            })
        }
        else throw Error;
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

router.post('/deleteUser', middleware.isAuthorized, async (req, res) => {
    const userDeletion = new UserDeletion;
    try {
        const status = await userDeletion.deleteUser(req.body.id);
        if(status instanceof Error) {
            return res.status(200).json({
                status: false,
                message: status.message,
            });
        }
        if(status) {
            return res.status(201).json({
                success: true,
                message: 'User deleted!',
            })
        }
        else throw Error;
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

module.exports = router