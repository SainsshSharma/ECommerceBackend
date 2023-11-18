const express=require("express");
const app=express();
const dotenv=require("dotenv")

const cors=require('cors')

app.use(cors())
app.use(express.json())

const userRoute=require("./routes/user")
app.use("/api/users",userRoute);

const authRouter=require("./routes/auth")
app.use("/api/auth",authRouter);

const productRoute=require("./routes/product")
app.use("/api/products",productRoute)

dotenv.config();

const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("success connection"))
.catch((err)=>console.log(err)) ;



app.listen(process.env.port || 5000,()=>{
    console.log("server running");
})

