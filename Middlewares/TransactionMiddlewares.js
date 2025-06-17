
const usersModel = require("../Models/UsersModel")
const bcrypt = require("bcrypt")
const transferInputValidator = async (request, response, next)=>{
    const {Username} = request.user
    const {Destination_wallet_id, Amount} = request.body

    if(!Destination_wallet_id){
        return response.status(401).json({message:"Receipent account number cannot be empty. Enter receipent's account number"})
    }
    if (!Amount || Amount < 500){
        return response.status(403).json({message:"Enter a transaction Amount. Minimum transaction amount is 500 Naira"})
    }
    
    const senderWallet= await walletModel.findOne({Username:Username})
    const senderWalletBalance = senderWallet.Account_balance

    if ({Amount} > senderWalletBalance){
        return response.status(403).json({message:"Amount entered is greater than what is you account"})
    }       
    next()

}
    


const validateTransactionPin = async (request, response, next) =>{
    const {Transaction_pin} = request.body
    const hashedTransactionPin = request.user.Transaction_pin
    if (!Transaction_pin){
        return response.status(403).json({Message:"No transaction pin entered. Please enter your transaction pin to proceed"})
    }
    const isValidTransactionPin = await bcrypt.compare(Transaction_pin, hashedTransactionPin)
    if (!isValidTransactionPin){
        return response.status(403).json({Message: "Incorrect pin"})
    }
    next()

}

module.exports = {
    transferInputValidator,
    validateTransactionPin
    
}