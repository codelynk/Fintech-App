
// importing required libraries
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const authRoutes = require("./Routes/AuthRoutes")
const transactionRoutes = require("./Routes/TransactionRoutes")
const userRoutes = require("./Routes/UserRoutes")

// setting up server
const app = express()
app.use(express.json())

// creating a port variable that specifies the port address through which instructions can be sent to the server appication
const PORT = process.env.PORT

// connection to mongodb database
const MONGODB_URI = process.env.DATABASE_URI || 4000
mongoose.connect(MONGODB_URI).then(()=>{
  console.log("Connected to Mongodb");
  app.listen(PORT, ()=>{console.log(`Server is running at port: ${PORT}...`)})
}) 


app.get('/', (request, response) => {
  response.send('Server is working!');
});

app.use("/auth", authRoutes)
app.use("/transaction", transactionRoutes)
app.use("/user",userRoutes)




