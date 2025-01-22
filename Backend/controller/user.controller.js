import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../model/user.model.js";

export const register = async ( req , res ) => {
    try {
        const { username , email , mobile , password } = req.body;

        if ( !username || !email || !mobile || !password ) {
            throw new Error("All fields are required!");
            res.status(400).json({"error": "All fields are required"} );
            return;
        }

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
            throw new Error("Please enter a valid email address.");
            res.status(400).json({ "error": "Please enter a valid email address." });
            return;
        }

        if ( mobile && !mobile.match(/^\d{10}$/) ) {
            throw new Error("Mobile number must be exactly 10 digits.");
            res.status(400).json({ "error": "Mobile number must be exactly 10 digits." });
            return;
        }

        const existingUser = await user.findOne({ email });

        if ( existingUser ) {
            throw new Error("User with this email already exists.");
            res.status( 409 ).json({ "error": "User with this email already exists." });
            return;
        }

        const hashedPassword = await user.hashPassword(password)

        const newUser = new user({
            username,
            email,
            mobile,
            password: hashedPassword
        });

        await newUser.save();

        const token = newUser.generateAuthToken();

        res.cookie( 'token' , token , { httpOnly: true } );

        res.status(201).json({ "message": "Seller registered successfully." , "token": token , "user": newUser });
        return;

    } catch ( err ) {
        throw err;
        res.status(500).json({"message": "message"});
        return;
    }
}