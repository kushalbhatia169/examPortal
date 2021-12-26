const express = require('express')
const { isEmpty } = require('lodash');
const UserRegistration = require('../controllers/UserRegistration');
const UserLogin = require('../controllers/UserLogin');
const UserUpdation = require('../controllers/UserUpdation');
const GetAllUsers = require('../controllers/GetAllUsers');
// const GetSingleUser = require('../controllers/GetSingleUser');
const UserDeletion = require('../controllers/UserDeletion');
// const VerifyUserEmail = require('../controllers/VerifyUserEmail');
const sendEmail = require("../utils/email");
const middleware = require("../middlewares");
// const Token = require("../models/token");
// const crypto = require('crypto');
// const AddNewContact = require('../controllers/AddNewContact');
// const GetContacts = require('../controllers/GetContacts');
// const GetChats = require('../controllers/GetChats');
const GetSecurityQuestion = require('../controllers/GetSecurityQuestion');
const ChangePassword = require('../controllers/ChangePassword');
const router = express.Router();

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
        // const token = await new Token({
        //     userId: _id,
        //     token: crypto.randomBytes(32).toString("hex"),
        //   }).save();
      
        // const message = `${process.env.BASE_URL}/verify/${_id}/${token.token}`;
        // await sendEmail(email, "Please confirm your Email account", message);
      
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
                    course, jwt: status["x-auth-token"]}
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

// router.put("/verify/phone/:id", async (req, res) => {
//     const userUpdation = new UserUpdation();
//     try {
//       const { id } = req.params;
//       const verify = 'phoneVerify'
//       const status = await userUpdation.updateUser(id, req, verify);
//         if(status instanceof Error) {
//             return res.status(200).json({
//                 success: false,
//                 message: 'Phone Number not verified!',
//             })
//         }
//         if(status){
//             return res.status(201).json({
//                 success: true,
//                 message: 'Phone number successfully verified!',
//             })
//         }
//         else {
//             throw Error;
//         }
//     } catch (error) {
//         res.status(400).send("An error occured");
//     }
// });

// router.get("/verify/:id/:token", async (req, res) => {
//     const verifyUserEmail = new VerifyUserEmail();
//     try {
//         const status = await verifyUserEmail.verifyUserEmail(req);
//         if(status instanceof Error) {
//             return res.status(200).send("Invalid link");
//         }
//         if(!status) throw Error;
//         return res.send("email verified sucessfully");
//     } catch (error) {
//       res.status(400).send("An error occured");
//     }
// });

router.put('/:id/update', middleware.isAuthorized, async(req, res)=>{
    const userUpdation = new UserUpdation();
    const id = req.params.id;
    try {
        const status = await userUpdation.updateUser(id, req);
        if(status instanceof Error) {
            return res.status(200).json({
                success: false,
                message:  status.message,
            })
        }
        if(status){
            const {_id, username, phoneNumber, email} = status;
            return res.status(201).json({
                success: true,
                data: {_id, username, phoneNumber, email},
                message: 'User updated!',
            })
        }
        else {
            throw Error;
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'User not updated!',
        })
    }
});

router.delete('/:id/delete',middleware.isAuthorized, async(req, res) => {
    const deleteUser = new UserDeletion;
    try {
        const status = await deleteUser.deleteUser(req);
        if(status instanceof Error) {
            return res.status(200).json({
                status: false,
                message:  status.message,
            });
        }
        console.log(status)
        if(status) {
            return res.status(201).json({
                success: true,
                message: 'user deleted!',
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'User not deleted!',
        })
    }
});

router.get('/users', middleware.isAuthorized, async(req, res)=> {
    const getAllUsers = new GetAllUsers;
    try {
        const status = await getAllUsers.getUsers(); 
        if(status instanceof Error || isEmpty(status)) {
            return res.status(200).json({
                status: false,
                message: status.message,
            });
        }
        if(status) {
            return res.status(201).json({
                success: true,
                data: {...status},
                message: 'fetched all user',
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'Users not fetched!',
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
            await sendEmail(status.email, "Otp sent from online portal", otp);
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

router.get('/verify/:otp', async (req, res) => {
    console.log(req.params, otp)
    try {
        if(parseInt(req?.params?.otp) !== otp) {
            return res.status(200).json({
                success:false, 
                message:"Invalid otp",
            });
        }
        else if(parseInt(req?.params?.otp) === otp) {
            return res.status(201).json({
                success: true,
                message: 'Email verified successfully',
            });
        }
        else throw Error;
    } 
    catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: error.message,
        })
    }
});

// router.post('/addContact',middleware.isAuthorized, async (req, res) => {
//     const addContact = new AddNewContact();
//     try {
//         const status = await addContact.addNewContact(req);
//         if(status instanceof Error) {
//             console.log(status)
//             return res.status(200).json({
//                 success: false,
//                 message: status.message,
//             });
//         }
//         if(status) {
//             return res.status(201).json({
//                 success: true,
//                 data: {...status?._doc},
//                 message: 'Contact added!',
//             })
//         }
//         else {
//             throw Error;
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             success: false,
//             error,
//             message: 'Contact not added!',
//         })
//     }
// })

// router.get('/contacts/:clientId', middleware.isAuthorized, async(req, res)=> {
//     const getContacts = new GetContacts();
//     try {
//         const status = await getContacts.getAllContacts(req);
//         if(status instanceof Error) {
//             return res.status(200).json({
//                 status: false,
//                 message: status.message,
//             });
//         }
//         if(status) {
//             return res.status(201).json({
//                 success: true,
//                 data: [...status],
//                 message: 'fetched all contacts',
//             })
//         }
//         else {
//             throw Error;
//         }
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             error,
//             message: 'Contacts not fetched!',
//         })
//     }
// });

// router.post('/getChats', middleware.isAuthorized, async(req, res) => {
//     const getMsgs = new GetChats();
//     try {
//         const status = await getMsgs.getChats(req);
       
//         if(status instanceof Error) {
//             return res.status(200).json({
//                 status: false,
//                 message: status.message,
//             });
//         }
//         if(status) {
//             return res.status(201).json({
//                 success: true,
//                 data: [...status],
//             })
//         }
//         else {
//             throw Error;
//         }
//     }
//     catch (error){
//         console.log(error)
//         return res.status(400).json({
//             success: false,
//             error,
//             message: 'Chats not fetched!',
//         })
//     }
// });

module.exports = router