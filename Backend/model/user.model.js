import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema( {
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
} , { timstamp: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.statics.hashPassword = async function ( password ) {
    return await bcrypt.hash( password , 10 );
}

userSchema.methods.comparePassword = async function ( password ) {
    return await bcrypt.compare( password , this.password );
}

const user = mongoose.model('user' , userSchema);
export default user;