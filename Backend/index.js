import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
import userRoute from "./route/user.route.js";
import sellerRoute from "./route/seller.route.js";
import cookieParser from "cookie-parser";
import Cors from 'cors';
const App = express();
App.use(express.json());
App.use(Cors());
App.use(cookieParser());

App.listen( process.env.PORT , () => {
    console.log(`Server is runnig on ${process.env.PORT }`);
});

connectDB();

App.use('/user' , userRoute);
App.use('/seller' , sellerRoute);
