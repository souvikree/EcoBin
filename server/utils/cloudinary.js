const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
dotenv.config()

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    // Delete the file after upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove file if failed to upload 
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
