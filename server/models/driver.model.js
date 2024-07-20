const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

driverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

driverSchema.methods.generateAuthToken = async function() {
    const driver = this;
    const token = jwt.sign({ _id: driver._id.toString() }, process.env.JWT_SECRET);
    driver.tokens = driver.tokens.concat({ token });
    await driver.save();
    return token;
};

driverSchema.statics.findByCredentials = async (email, password) => {
    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return driver;
};

driverSchema.methods.toJSON = function() {
    const driver = this.toObject();
    delete driver.password;
    delete driver.tokens;
    return driver;
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
