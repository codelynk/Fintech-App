const {userAuthorization} = require("../Middlewares/AuthMiddlewares")
const {transferInputValidator,validateTransactionPin}= require("../Middlewares/TransactionMiddlewares")
const {intraBankTransferEngine,walletBalanceChecker,transactionHistoryChecker} = require("../Controllers/TransactionControllers")
const express = require("express")
const router = express.Router()

router.post("/transfer",userAuthorization,transferInputValidator,validateTransactionPin,intraBankTransferEngine)
router.get("/walletbalance",userAuthorization,walletBalanceChecker)
router.get("/transaction-history",userAuthorization,transactionHistoryChecker)

module.exports = router