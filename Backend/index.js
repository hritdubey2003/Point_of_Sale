import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
import userRoute from "./route/user.route.js";
import sellerRoute from "./route/seller.route.js";
import cookieParser from "cookie-parser";
const App = express();
App.use(express.json());

import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,  // Allow cookies to be sent and received
};

App.use(cors(corsOptions));

App.use(cookieParser());

App.listen( process.env.PORT , () => {
    console.log(`Server is running on ${process.env.PORT }`);
});

connectDB();

App.use('/user' , userRoute);
App.use('/seller' , sellerRoute);
