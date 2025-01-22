import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const AuthUser = async ( req , res , next ) => {
    try {
        const token = req.cookie.token;

        if ( !token ) {
            return res.status('You are not Authorized!');
        }

        const user = JsonWebTokenError.verify( token , process.env.JWT_SECRET );
        req.user = user 
        next();
    } catch ( err ) {
        console.error( err );
        return ;
    }
}