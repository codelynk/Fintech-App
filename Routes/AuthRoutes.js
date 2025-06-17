const express = require("express");
const router = express.Router();
const { handleLogin, handleGetAllUsers, handleForgotPassword, handleUserRegistration, handleResetPassword } = require("../Controllers/AuthControllers");
const { Userauthorization, emailValidator, improperInputs,missingInputs} = require("../Middlewares/AuthMiddlewares");

router.post("/sign-up",improperInputs, emailValidator,missingInputs, handleUserRegistration);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword)
router.patch("/reset-password",  handleResetPassword)
router.get("/verify-reset-token", handleVerifyResetToken)


// router.get("/all-users", authorization, handleGetAllUsers)






module.exports = router