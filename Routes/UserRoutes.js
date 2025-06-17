const express = require("express")
const router = express.Router()
const handleGetAllUsers = require("../Controllers/UserControllers")
const {adminAuthorization} = require("../Middlewares/AuthMiddlewares")


router.get("/all-users",adminAuthorization, handleGetAllUsers)
module.exports= router