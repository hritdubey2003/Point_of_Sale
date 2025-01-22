import express from "express";
import { register } from "../controller/user.controller.js";

const userRoute = express.Router();

userRoute.post('/register' , register)

export default userRoute;