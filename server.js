import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import notes from "./controller/notes.js";
import signUp from "./controller/signUp.js";
import login from "./controller/login.js"
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
dotenv.config();
const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Ange versionen av OpenAPI
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "API för att hantera användare och anteckningar",
    },
    servers: [
      {
        url: "http://localhost:8080", 
      },
    ],
  },
  apis: ["./controller/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
mongoose.connect(process.env.BASE_URL);
const dataBase = mongoose.connection;

dataBase.on("error", (err) => {
  console.error("database connection error", err);
  process.exit(1)
});

dataBase.once("connected", () => {
  console.log("Connected to DATABASE");
});
app.use("/api/notes", notes);
app.use("/api/signup", signUp);
app.use("/api/login", login)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Connected to the PORT:${PORT}`);
  console.log("the docs for the api u can find at http://localhost:8080/api-docs")
});