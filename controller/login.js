import express  from "express";
import dotenv from "dotenv"
import user from "../model/signUpSchema.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config()

const router = express.Router()

router.post("/", async(req, res)=>{
    try{
const {username ,password} = req.body

if(!username || !password) {
    return res.status(400).json({MEssage:"u have to use both usrname and password"})
}
    const findUser = await user.findOne({username})
    if(!findUser){
        return res.status(401).json({Message:"Invalid email or password"})
    }

const checkPassword = await bcrypt.compare(password, findUser.password)
if(!checkPassword){
    return res.status(401).json({Message:"invalid username or password"})
}

const token = jwt.sign({
    id: findUser._id, username: findUser.username
}, process.env.SECRET_KEY,
{expiresIn: "1hr"})

    res.json({message: "logged in", token})
}catch(error){
    res.status(500).json({ message: 'Server error' });
}

})

router.get("/", (req, res) => {
    res.send("login route is working!");
  });


export default router