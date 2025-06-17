const jwt = require("jsonwebtoken") 
const usersModel = require("../Models/UsersModel")
const {validEmail,sendForgotPasswordEmail} = require("../Services/EmailServices")

// Middleware that checks for missing inputs in user registration form 
const missingInputs = (request, response, next) =>{
        const {Username, Email, Password} = request.body

        const errors = []

        if (!Username){
            errors.push("No username entered. Please enter username")
        }
            
        if (!Password){
            errors.push("No password entered. Please enter your password")
        }

        if (!Email){
            errors.push("No email entered. Please enter your email")
        }

        if (errors.length > 0){
            return response.status(400).json({message:errors})
        }
        next()
    }

// 2. Middlewares that checks for invalid or non-unique details in users registration form
    const emailValidator =(request, response, next)=>{
        const {Email} = request.body
        if(!validEmail(Email)){
        return response.status(404).json({message:"Incorrect email format"})
        }
        next()
    }
    const improperInputs = async (request, response, next) =>{

         const {Username, Email} = request.body
        
        const existingUsername = await usersModel.findOne({Username: Username})

        if (existingUsername) {
        return response.status(404).json({message:"Username is  already taken"})
        }

        const existingEmail = await usersModel.findOne({Email: Email})

        if (existingEmail){
        return response.status(404).json({message:"email already exists"})
        }
        next()
    }




    const userAuthorization = async (request, response, next)=>{

        const token = request.header("Authorization")

        if(!token){
            return response.status(401).json({message: "Please login!"})
        }

        const splitToken = token.split(" ")

         if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
            return response.status(401).json({ message: "Invalid token format" });
        }

        const actualToken = splitToken[1]

       let decodedAccessToken;
        try {
            decodedAccessToken = jwt.verify(actualToken, process.env.ACCESS_TOKEN);
        } 
        catch (error) {
            return response.status(500).json({ message: "Token verification failed" });
        }

        const user = await usersModel.findById(decodedAccessToken.id)

        if(!user){
            return response.status(404).json({message: "User account does not exist"})
        }

    

        // if(user?.role !== "admin"){
        //     return res.status(401).json({message: "Invalid AUTHORIZATION"})
        // }

        request.user = user

        next()

    }


    const adminAuthorization = async (request, response, next)=>{

        const token = request.header("Authorization")

        if(!token){
            return response.status(401).json({message: "Please login!"})
        }

        const splitToken = token.split(" ")

         if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
            return response.status(401).json({ message: "Invalid token format" });
        }

        const actualToken = splitToken[1]

       let decodedAccessToken;
        try {
            decodedAccessToken = jwt.verify(actualToken, process.env.ACCESS_TOKEN);
        } 
        catch (error) {
            return response.status(500).json({ message: "Token verification failed" });
        }

        const user = await usersModel.findById(decodedAccessToken.id)

        if(!user){
            return response.status(404).json({message: "User account does not exist"})
        }

        if(user?.Role !== "admin"){
            return res.status(401).json({message: "Invalid AUTHORIZATION"})
        }

        next()

    }
    
module.exports = {
    missingInputs,
    emailValidator,
    improperInputs,
    userAuthorization,
    adminAuthorization,
}