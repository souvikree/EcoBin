const Driver = require('../models/driver.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, vehicleNumber, password } = req.body;

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const driver = new Driver({
      name,
      email,
      phone,
      vehicleNumber,
      password,
    });

    await driver.save();
    const token = await driver.generateAuthToken();

    res.status(201).json({ driver: driver.toJSON(), token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findByCredentials(email, password);

    const token = await driver.generateAuthToken();

    res.status(200).json({ driver: driver.toJSON(), token });
  } catch (error) {
    res.status(400).json({ message: 'Invalid email or password' });
  }
};

const logoutDriver = async (req, res) => {
  try {
    req.driver.tokens = req.driver.tokens.filter((token) => token.token !== req.token);
    await req.driver.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    driver.resetPasswordToken = token;
    driver.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await driver.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: driver.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const driver = await Driver.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!driver) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    driver.password = password;
    driver.resetPasswordToken = undefined;
    driver.resetPasswordExpires = undefined;
    await driver.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { phone, email, vehicleNumber } = req.body;

    if (!phone && !email && !vehicleNumber) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const driver = await Driver.findById(req.driver._id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (email) {
      const existingDriver = await Driver.findOne({ email });
      if (existingDriver && existingDriver._id.toString() !== driver._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      driver.email = email;
    }

    if (phone) {
      driver.phone = phone;
    }

    if (vehicleNumber) {
      driver.vehicleNumber = vehicleNumber;
    }

    await driver.save();

    res.status(200).json({ driver: driver.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  logoutDriver,
  forgotPassword,
  resetPassword,
  updateDriver,
};
