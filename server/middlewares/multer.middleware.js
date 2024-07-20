const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");   // File will be saved here temporarily
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // File name will be original name
    }
});

const upload = multer({ 
    storage, 
});

module.exports = { upload };
