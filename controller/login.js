import express  from "express";
import dotenv from "dotenv"
import user from "../model/signUpSchema.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config()

const router = express.Router()
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Loggar in som användare
 *     description: Logs in a user by verifying username and password, then returning a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: user123
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in and received JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully"
 *                 token:
 *                   type: string
 *                   example: "your-jwt-token-here"
 *       400:
 *         description: Missing username or password, or invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post("/", async(req, res)=>{
    try{
const {username ,password} = req.body

if(!username || !password) {
    return res.status(400).json({message:"u have to use both usrname and password"})
}
    const findUser = await user.findOne({username})
    if(!findUser){
        return res.status(401).json({message:"Invalid email or password"})
    }

const checkPassword = await bcrypt.compare(password, findUser.password)
if(!checkPassword){
    return res.status(401).json({message:"invalid username or password"})
}

try{
    const token = jwt.sign({
        id: findUser._id, username: findUser.username
    }, process.env.AUTH_KEY,
    {expiresIn: "1hr"})
    
    res.json({message: "logged in", token})
}catch(err){
    res.status(500).json({ message: 'Error generating token', error: err.message })
}
    
}catch(error){
    res.status(500).json({ message: 'Server error' });
}
})

router.get("/", (req, res) => {
    res.send("login route is working!");
  });


export default router