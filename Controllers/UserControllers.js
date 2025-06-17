const usersModel = require("../Models/UsersModel")

const handleGetAllUsers = async (request,response) =>{
    try{
        const users = await usersModel.find().select("-Password")
        return response.status(200).json({Message:"Success",users})
    
    }
    catch(error){
        console.error("Error fetching users:", error);
        return response.status(500).json({message:"Server Error", error:error.message})
    }
}

module.exports = handleGetAllUsers 
