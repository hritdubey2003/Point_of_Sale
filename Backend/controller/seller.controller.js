import seller from "../model/seller.model.js";
import cookieParser from "cookie-parser";

export const register = async ( req , res ) => {
    try {
        const { username, email, mobile, password } = req.body;

        if ( !username || !email || !mobile || !password ) {
            return res.status(400).json({ "error": "All fields are required." });
        } 

        if ( email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
            return res.status(400).json({ "error": "Please enter a valid email address." });
        }

        if ( mobile && !mobile.match(/^\d{10}$/) ) {
            return res.status(400).json({ "error": "Mobile number must be exactly 10 digits." });
        }

        const existingSeller = await seller.findOne({ email });

        if ( existingSeller ) {
            return res.status( 409 ).json({ "error": "Seller with this email already exists." });
        }

        const hashedPassword = await seller.hashPassword( password );

        const newSeller = new seller({
            username,
            email,
            mobile,
            password: hashedPassword
        });
        await newSeller.save();

        return res.status(201).json({ "message": "Seller registered successfully." , "seller": newSeller });
    } catch ( err ) {
        return res.status(500).json({"error": "An unexpected error occurred. Please try again later."});
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

        const loggedseller = await seller.findOne({ email });

        if ( !loggedseller ) {
            return res.json(400).json({"error": "Seller is not available with this mail!"});
        }

        const isPasswordValid = await loggedseller.comparePassword(password);

        if ( !isPasswordValid ) {
            return res.status(401).json({ message: "Invalid credentials!" } );
        }

        const token = loggedseller.generateAuthToken();
        res.cookie( 'token' , token , { httpOnly: true } );
        return res.status(200).json({"Message": "Logged In Successfully!", "token": token , "seller": loggedseller})
    } catch( err ) {
        console.error( err );
        return res.status(500).json({"error": "An unexpected error occured!"});
    }
}