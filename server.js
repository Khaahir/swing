import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import notes from "./controller/notes.js";
import singUp from "./controller/singUp.js";
import login from "./controller/login.js"
dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.BASE_URL);
const dataBase = mongoose.connection;

dataBase.on("error", (err) => {
  console.error(err);
});

dataBase.once("connected", () => {
  console.log("Connected to DATABASE");
});
app.use("/api/notes", notes);
app.use("/api/signup", singUp);
app.use("/api/login", login)


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Connected to the PORT:${PORT}`);
});