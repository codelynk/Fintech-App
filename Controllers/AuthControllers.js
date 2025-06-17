const usersModel = require("../Models/UsersModel")
const walletModel = require("../Models/WalletModel")
const bcrypt = require("bcrypt");
const { error } = require("console");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")
const {v4:uuidv4} = require("uuid")


const handleUserRegistration = async (request,response)=>{
    try{
        const {Username,Password,Email,Transaction_pin} = request.body
        const hashedPassword = await bcrypt.hash(Password, 12)
        const hashedTransactionPin = await bcrypt.hash(Transaction_pin,12)
        const newUserDocument = await usersModel.create({Username,Email,Password:hashedPassword,Transaction_pin:hashedTransactionPin})
        const newWalletDocument = await walletModel.create({
            Username:newUserDocument.Username,
            Wallet_id: uuidv4()

        })
        return response.status(200).json({
            message:"success",
            user:{
                Username: newUserDocument.Username,
                Email:newUserDocument.Email,
                Role:newUserDocument.Role,
                Account_balance:newUserDocument.Account_balance},
            newWalletDocument
        })

    }
    catch (error) {
      response.status(500).json({ message: error.message });
    }
}

     
const handleLogin = async (request,response)=>{
    // logic for updating a user's documents  with two tokens that will ratify him/her as being logged in
    try{
        const {Email, Password} = request.body

        const existingUser = await usersModel.findOne({Email: Email}) 

        if (!existingUser){
            return response.status(400).json({message:"you do not have an account"})
        }

        const isMatch = await bcrypt.compare(Password, existingUser?.Password)
    
        if (!isMatch){
        return response.status(404).json({message: "Incorrect password or email"})
        }

        const accessToken =  jwt.sign({id:existingUser._id},process.env.ACCESS_TOKEN,{expiresIn:"450min"})

        const refreshToken = jwt.sign({id:existingUser._id},process.env.REFRESH_TOKEN, {expiresIn:"1000min"})
        
        // logic for returning  our response to our client 
        const {Username} = existingUser
        const existingUserWallet = await walletModel.findOne({Username:Username})
        return response.status(200).json({
            message:"success",
            accessToken,
            user:{
                    Username:existingUser?.Username,
                    Email:existingUser?.Email,
                    Role:existingUser?.Role},
            Wallet:{
                     Wallet_id:existingUserWallet?.Wallet_id,
                     Account_balance:existingUserWallet.Account_balance
                            },
            refreshToken
        })
    }

    catch (error) {
        response.status(500).json({ message: error.message })
    }
}


const handleForgotPassword = async (request, response) => {
    try {
        const{Email} = request.body
        const user = usersModel.findOne({Email:Email})
        if(!user){
            return response.json({Message:"please check your mailbox for a link to complete the reset"})
            }
        response.json({Message:"Please check your mailbox for a link to complete the reset"})
       // Generate secure token
      const token = crypto.randomBytes(32).toString("hex");
  
      // Set token and expiry in your database(e.g., valid for 1 hour)
      user.resetToken = token;
      user.resetTokenExpires = Date.now() + 3600000; // 1 hour in ms
  
      await user.save();
  
      // Send reset email
      await sendForgotPasswordEmail(user.Email, token);
      response.status(200).json({Message:"Password reset email sent."});
    } 
    catch (error) {
      console.error("Error requesting password reset:", error);
    }
  };

  const handleVerifyResetToken = async (request,response) =>{
    try{
        const token = request.params
        const user = usersModel.findOne({resetToken:token, resetTokenExpires: { $gt: Date.now()}})
        if(!user){
            return response.status(400).json({Message:"expired token"})
        }
        return response.status(200).json({ message: "Token is valid", email: user.email });
        } 
    catch (error) {
    console.error({ message: "Server error", error });
    }
  }

  const handleResetPassword = async(request,response) => {
    try {
        const {token, newPassword} = request.body
        const user = usersModel.findOne({resetToken:token, resetTokenExpires:{$gt:Date.now()}})
        if(!user){
            return response.status(400).json({Message:"Invalid or Expired Token!"})
        }
        hashedNewPassword = await bcrypt.hash(newPassword, 12)
        user.Password = hashedNewPassword
        await user.save()
    }
    catch (error){
        response.status(500).json({Message: "Server error", error})
    }

  }



module.exports = {
    handleUserRegistration,
    handleLogin,
    handleForgotPassword,
    handleVerifyResetToken,
    handleResetPassword
}