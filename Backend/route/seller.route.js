import express from "express";
import { register } from "../controller/seller.controller.js";
const sellerRoute = express.Router();


sellerRoute.post('/register', register );

export default sellerRoute;