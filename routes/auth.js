const router=require("express").Router();
const User=require("../models/User")
const CryptoJs=require("crypto-js")
const jwt=require("jsonwebtoken")
//Register

router.post("/register",async(req,res)=>{
    console.log(req.body.username)
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password,process.env.PASS_KEY).toString(),     
    });

    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

//LOGIN

router.post("/login",async (req,res)=>{
    
    try{
        const user = await User.findOne({username:req.body.username})

        const hashedPass=CryptoJs.AES.decrypt(user.password,process.env.PASS_KEY)
        const OriginalPassword=hashedPass.toString(CryptoJs.enc.Utf8);

        !user && res.status(401).json("wrong credentials")

        OriginalPassword!==req.body.password && res.status(401).json("wrong credentials")

        const accessToken=jwt.sign({
            id:user._id, isAdmin:user.isAdmin,

        },process.env.JWT_SEC,{expiresIn:"3d"})

        const{ password ,...others}=user._doc;

        res.status(200).json({...others,accessToken});
    }
    catch(err){
        res.status(500).json(err)
    }

})

module.exports=router