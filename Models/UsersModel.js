const mongoose = require("mongoose")
const usersModelSchema = new mongoose.Schema({
    Username: {type:String, unique:true, required:true},
    Password:{type:String, required: true},
    Email:{type:String, unique: true, required: true},
    isVerified: {
    type: Boolean, required:true,
    default: false
    },
    Transaction_pin:{type:String,required:true},
    Role:{type:String, required:true, enum:["user","admin"], default:"user"},
    resetToken: {String},
    resetTokenExpires:{Date}},
    {timestamps:true})

const usersModel = mongoose.model("users", usersModelSchema)
module.exports = usersModel