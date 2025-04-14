import express from "express";
import dotenv from "dotenv";
import SingUp from "../model/signUpSchema.js";
dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
      return res
        .status(400)
        .json({ Message: "you have to use username and password" });
    }

    const newUser = new SingUp({
      username,
      password,
    });

    await newUser.save();
    res.status(200).json({ Message: "new user is created", newUser });
  } catch (error) {
    res.status(500).json({ Message: "could not create a new user", error });
  }
});

// In controller/singUp.js
router.get("/", (req, res) => {
  res.send("Signup route is working!");
});

export default router;
