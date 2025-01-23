import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../model/user.model.js";

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