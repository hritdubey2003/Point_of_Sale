import express from "express";
import { login, register } from "../controller/seller.controller.js";
const sellerRoute = express.Router();


sellerRoute.post('/register', register );
sellerRoute.post('/login', login );

export default sellerRoute;