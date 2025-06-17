const walletModel = require("../Models/WalletModel")
const transactionModel = require("../Models/TransactionModel")


const intraBankTransferEngine = async (request,response)=>{
    try{
        const {Username} = request.user
        const {Destination_wallet_id,Transaction_pin,Amount,Remarks} = request.body 
        const senderWalletDoc = await walletModel.findOne({Username:Username})
        const destinationWalletDoc = await walletModel.findOne({Wallet_id:Destination_wallet_id})

        senderWalletDoc.Account_balance -= Number(Amount)
        destinationWalletDoc.Account_balance += Number(Amount)

        await senderWalletDoc.save();
        await destinationWalletDoc.save();

        const newTransactionDocument = await transactionModel.create({Destination_wallet_id,Sender_wallet_id:senderWalletDoc.Wallet_id,Transaction_pin,Amount,Remarks})
        
        return response.status(200).json({Message:"Successful",newTransactionDocument}) 

    
    }

catch (error) {
        console.error("Transfer error:", error);
        return response.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const walletBalanceChecker =async (request, response) =>{
    try{
        const {Username} = request.body
        
        const userWallet = await walletModel.findOne({Username: Username})

        return response.status(200).json(userWallet?.Account_balance)
    }
    catch (error){
        console.error("Error")
        return response.status(500).json({Message: "Internal Server Error"})

    }
}

const transactionHistoryChecker = async (request, response)=>{
    try{
        const {Username} = request.body
        const userWallet = await walletModel.findOne({Username: Username})
        const UserWalletId = userWallet.Wallet_id
        const transactionHistory = await transactionModel.find({ $or:[{Sender_wallet_id:UserWalletId},{Destination_wallet_id:UserWalletId}]})
        return response.status(200).json({transactionHistory})


    }
    catch (error) {
        console.error("Error")
        return response.status(500).json({Message: "Internal Server Error"})
    }
}

module.exports = {intraBankTransferEngine, walletBalanceChecker, transactionHistoryChecker}

