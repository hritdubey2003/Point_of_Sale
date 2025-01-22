import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";

const App = express();

App.listen( process.env.PORT , () => {
    console.log(`Server is runnig on ${process.env.PORT }`);
})

connectDB();

