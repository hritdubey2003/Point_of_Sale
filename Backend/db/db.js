import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connect( process.env.MONGO_URI )
        console.log(`MongoDB connected to ${process.env.MONGO_URI}`);
    } catch ( err ) {
        console.error(err);
        console.log('I got this error ' , err );
    }
}

export default connectDB;