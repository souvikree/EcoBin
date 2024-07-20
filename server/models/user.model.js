const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            index: true  
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        fullName:{
            type: String
        },
        userImage: {
            type: String, // cloudinary url
        },
        // reportHistory: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Report'
        //     }
        // ],
        
        refreshToken: {
            type: String
        },
        phoneNumber:{
            type:String
        },
        location:{
            type:String,
        }
    }, { timestamps: true }
);

// Middleware - Bcrypt the password before save only when the password is modified
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Check if the password is correct
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// AccessToken contains more details than refresh token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generates refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
