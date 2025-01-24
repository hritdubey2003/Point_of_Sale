import express from "express";
import { addServiceToCart, getAllServices, login, logout, purchaseFromCart, register, removeServiceFromCart, getCart } from "../controller/user.controller.js";
import { AuthUser } from "../middleware/Auth.middleware.js";

const userRoute = express.Router();

userRoute.post('/register' , register);
userRoute.post('/login' , login);
userRoute.get('/services' , AuthUser , getAllServices );
userRoute.post('/cart/add' , AuthUser ,addServiceToCart );
userRoute.post('/cart/remove' , AuthUser, removeServiceFromCart );
userRoute.get('/cart/purchase' , AuthUser , purchaseFromCart );
userRoute.get('/getcartItems', AuthUser, getCart);
userRoute.post('/logout' , AuthUser , logout );

export default userRoute;