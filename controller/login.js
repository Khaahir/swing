import express  from "express";
import dotenv from "dotenv"
import singUp from "./controller/singUp.js";
dotenv.config()

const router = express.Router()

router.post("/" ,  async(req, res)=>{
const {username ,password} = req.body

if(!username || !password) {
    return res.status(400).json({MEssage:"u have to use both usrname and password"})
}
try{
    const user = await singUp.findOne({username})
    if(!user){
        return res.status(401).json({Message:"Invalid email or password"})
    }

    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({message: "logged in"})
}catch(error){
    res.status(500).json({ message: 'Server error' });
}

})