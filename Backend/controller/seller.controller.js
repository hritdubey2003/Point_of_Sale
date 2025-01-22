import seller from "../model/seller.model.js";
import cookieParser from "cookie-parser";

export const register = async ( req , res ) => {
    try {
        const { sellerName, email, mobile, password } = req.body;

        if ( !sellerName || !email || !mobile || !password ) {
            throw new Error("All fields are required.");
            res.status(400).json({ "error": "All fields are required." });
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

        const existingSeller = await seller.findOne({ email });

        if ( existingSeller ) {
            throw new Error("Seller with this email already exists.");
            res.status( 409 ).json({ "error": "Seller with this email already exists." });
            return;
        }

        const hashedPassword = await seller.hashPassword( password );

        const newSeller = new seller({
            sellerName,
            email,
            mobile,
            password: hashedPassword
        });

        const token = newSeller.generateAuthToken();

        await newSeller.save();

        res.cookie( 'token' , token , { httpOnly: true } );

        res.status(201).json({ "message": "Seller registered successfully." , "token": token , "seller": newSeller });
        return;
    } catch ( err ) {
        throw err;
        console.error(err);
        res.status(500).json({"error": "An unexpected error occurred. Please try again later."});
        return;
    }
}