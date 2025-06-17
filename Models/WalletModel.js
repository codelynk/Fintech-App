const mongoose = require("mongoose")
const walletSchema = new mongoose.Schema({
    Username: {type:String, required:true},
    Wallet_id:{type:String, required:true, unique:true},
    Account_balance:{type:Number,required:true, default:0.00},
    Currency:{type:String, required: true, enum:["NGN","USD","EUR","GBP","JPY","CAD"], default: "NGN"}},
    {timestamps:true})

walletModel = mongoose.model("wallets",walletSchema)

module.exports = walletModel
// account_balance (float/decimal)

// currency (e.g., "NGN", "USD")

// wallet_id or account_number

// linked_bank_accounts (array or object with bank name, account number, etc.)

// transaction_pin_hash



