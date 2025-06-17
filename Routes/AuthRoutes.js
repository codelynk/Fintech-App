const express = require("express");
const router = express.Router();
const { handleUserRegistration, handleLogin, handleForgotPassword, handleResetPassword, handleVerifyResetToken } = require("../Controllers/AuthControllers");
const { adminAuthorization, emailValidator, improperInputs,missingInputs} = require("../Middlewares/AuthMiddlewares");



router.post("/sign-up",improperInputs, emailValidator,missingInputs, handleUserRegistration);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword)
router.patch("/reset-password",  handleResetPassword)
router.get("/verify-reset-token", handleVerifyResetToken)






module.exports = router