require("dotenv").config()
const express=require("express")
const mongoose= require("mongoose")
const cors = require("cors")


const app= express()
app.use(express.json())
app.use(cors())

app.use("/", require("./routes/routes"))

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("connected Successfully")
  } catch (error) {
    console.log(error)
  }
}

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
  connect()
  console.log(`server is running on ${PORT}`)
})