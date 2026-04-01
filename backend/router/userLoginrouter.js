const express = require('express');
const {
    registerUser,
    verifyOtp,
    socialLogin,
    // resendOtp,
    sendOtp,
    getUser
} = require('../Controller/userLoginController');
const authMiddleware = require('../MiddleWare/MiddleWare');

const userRouter = express.Router();


userRouter.get("/get-user", authMiddleware, getUser);
userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/send-otp", sendOtp); // Optional OTP route
userRouter.post('/social-login', socialLogin);


module.exports = userRouter;
