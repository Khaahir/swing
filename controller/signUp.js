import express from "express";
import dotenv from "dotenv";
import user from "../model/signUpSchema.js";
import bcrypt from "bcryptjs";
dotenv.config();
const router = express.Router();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Skapa en ny användare
 *     description: Skapar en ny användare med användarnamn och lösenord.
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
 *                 description: The username of the new user.
 *                 example: user123
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: password123
 *     responses:
 *       201:
 *         description: New user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: User already exists or missing username/password
 *       500:
 *         description: Server error
 */

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ Message: "you have to use username and password" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)

   const existingUser = await user.findOne({username})
   if(existingUser){
    return res.status(400).json({Message: "user already exsist"})
   }

    const newUser = new user({
      username,
    password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ Message: "new user is created", newUser });
  } catch (error) {
    res.status(500).json({ Message: "could not create a new user", error: error.message });
  }
});



export default router;
