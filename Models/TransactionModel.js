const mongoose = require("mongoose")
const {v4:uuidv4} = require("uuid")
transactionSchema = new mongoose.Schema({
    Amount:{type:Number, required:true, default:0.00},
    Currency:{type:String, required:true, enum:["NGN","USD"], default:"NGN"},
    Sender_wallet_id:{type:String,required:true},
    Transaction_pin:{type:String,required:true},
    Destination_wallet_id:{type:String,required:true},
    Remarks:{type:String, default:""}
    // Type:{type:String, required:true, enum:["deposit","withdrawal","transfer","payment"]},
    // Status:{type:String, required:true, enum:["pending","completed","failed","cancelled"]},
    // External_reference:{type:String, required:true, unique:true},
    // Destination_bank:{type:String,required:true},
    // Transaction_fees:{type:Number,required:true,default:0.00}
    },
    {timestamp:true})

transactionModel = mongoose.model("transactions",transactionSchema)
module.exports = transactionModel
