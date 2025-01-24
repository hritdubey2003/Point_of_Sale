import express from "express";
import { createService, deleteService, editService, login, logout, register, viewServices } from "../controller/seller.controller.js";
import { AuthUser } from "../middleware/Auth.middleware.js";
import seller from "../model/seller.model.js";
const sellerRoute = express.Router();


sellerRoute.post('/register', register );
sellerRoute.post('/login', login );
sellerRoute.post('/create' , AuthUser , createService);
sellerRoute.get('/services' , AuthUser , viewServices );
sellerRoute.put('/services/:id' , AuthUser , editService );
sellerRoute.delete('/services/:serviceId' , AuthUser , deleteService );
sellerRoute.get('/logout' , AuthUser , logout );

export default sellerRoute;