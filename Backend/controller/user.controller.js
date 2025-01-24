import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../model/user.model.js";
import Service from "../model/service.model.js";
import Purchased from "../model/purchased.model.js";

export const register = async ( req , res ) => {
    try {
        const { username , email , mobile , password } = req.body;

        if ( !username || !email || !mobile || !password ) {
            return res.status(400).json({"error": "All fields are required"} );    
        }

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {  
            return res.status(400).json({ "error": "Please enter a valid email address." });
        }

        if ( mobile && !mobile.match(/^\d{10}$/) ) {
            return res.status(400).json({ "error": "Mobile number must be exactly 10 digits." });
        }

        const existingUser = await user.findOne({ email });

        if ( existingUser ) {
            return res.status( 409 ).json({ "error": "User with this email already exists." });
        }

        const hashedPassword = await user.hashPassword(password)

        const newUser = new user({
            username,
            email,
            mobile,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ "message": "User registered successfully." , "token": token , "user": newUser });

    } catch ( err ) {
        console.error(err);        
        return res.status(500).json({"message": "message"});
    }
}

export const login = async ( req , res ) => {
    try {
        const { email , password } = req.body;

        if ( !email || !password ) {
            return res.status(400).json({"error": "All Fileds are required!"});
        }

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
            return res.status(400).json({ "error": "Please enter a valid email address." });
        }

        const loggeduser = await user.findOne({ email });

        if ( !loggeduser ) {
            return res.status(400).json({ "error": "There is no one with this email!" });
        }

        const isPasswordValid = await loggeduser.comparePassword(password);

        if ( !isPasswordValid ) {
            return res.status(401).json({ message: "Invalid credentials!" } );
        }

        const token = loggeduser.generateAuthToken();
        res.cookie( 'token' , token , { httpOnly: true } );
        return res.status(200).json({"user": loggeduser , "token": token , "Message": "Logged In Successfully!"});

    } catch( err ) {
        console.error(err);
        return res.status(500).json({"error": "An unexpected error occured!"});
    }
}

export const getAllServices = async (req, res) => {
    try {
      const services = await Service.find(); // Retrieve all services from the database
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error('Error fetching services:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching services.',
      });
    }
  };

  export const addServiceToCart = async (req, res) => {
    const { serviceId, sellerId, quantity = 1 } = req.body; // Get service details from request body
    const userId = req.user._id; // Get the userId from the authenticated user (from middleware)
  
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
  
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, services: [], totalPrice: 0 });
      }
  
      const serviceIndex = cart.services.findIndex(
        (item) => item.serviceId.toString() === serviceId
      );
  
      if (serviceIndex > -1) {
        cart.services[serviceIndex].quantity += quantity;
      } else {
        cart.services.push({ serviceId, sellerId, quantity });
      }
  
      cart.totalPrice += service.price * quantity;
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: 'Service added to cart successfully',
        cart,
      });
    } catch (error) {
      console.error('Error adding service to cart:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error while adding service to cart',
      });
    }
  };
  

  export const removeServiceFromCart = async (req, res) => {
    const { serviceId } = req.body; // Get the serviceId from the request body
    const userId = req.user._id; // Get the userId from the authenticated user (from middleware)
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }
  
      const serviceIndex = cart.services.findIndex(
        (item) => item.serviceId.toString() === serviceId
      );
  
      if (serviceIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Service not found in the cart',
        });
      }
  
      const removedService = cart.services[serviceIndex];
      const service = await Service.findById(removedService.serviceId);
      cart.totalPrice -= service.price * removedService.quantity;
      cart.services.splice(serviceIndex, 1);
  
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: 'Service removed from cart successfully',
        cart,
      });
    } catch (error) {
      console.error('Error removing service from cart:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error while removing service from cart',
      });
    }
  };
  
  export const purchaseFromCart = async (req, res) => {
    const userId = req.user._id; // Get the userId from the authenticated user (from middleware)
  
    try {
      const cart = await Cart.findOne({ userId }).populate('services.serviceId');
      if (!cart || cart.services.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Add services before purchasing.',
        });
      }
  
      let totalCost = 0;
      const purchasedServices = [];
  
      for (const item of cart.services) {
        const service = await Service.findById(item.serviceId);
  
        if (!service) {
          return res.status(404).json({
            success: false,
            message: `Service with ID ${item.serviceId} not found.`,
          });
        }
  
        totalCost += service.price * item.quantity;
  
        service.purchasedCount += item.quantity;
        await service.save();
  
        purchasedServices.push({
          serviceId: item.serviceId,
          sellerId: item.sellerId,
          quantity: item.quantity,
        });
      }
  
      const newPurchase = new Purchased({
        userId,
        services: purchasedServices,
        totalPrice: totalCost,
      });
      await newPurchase.save();
  
      cart.services = [];
      cart.totalPrice = 0;
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: 'Purchase successful! Thank you for shopping.',
        totalCost,
        purchasedAt: newPurchase.purchasedAt,
        purchasedId: newPurchase._id,
      });
    } catch (error) {
      console.error('Error during purchase:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error while processing the purchase.',
      });
    }
  };
  

  export const logout = async (req, res) => {
    try {
      // Clear the authentication token stored in cookies
      res.clearCookie('token', { httpOnly: true });
      
      return res.status(200).json({
        success: true,
        message: 'Successfully logged out!',
      });
    } catch (error) {
      console.error('Error during logout:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error while logging out.',
      });
    }
};

  