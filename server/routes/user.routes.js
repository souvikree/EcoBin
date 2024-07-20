const { Router } = require('express');

const { upload } = require('../middlewares/multer.middleware.js');
const verifyJWT = require('../middlewares/auth.middleware.js');
const { loginUser, logoutUser, registerUser } = require('../Controllers/user.controller.js');
const router = Router();

//routers
router.route('/register').post(
  upload.fields([
    {
      name: 'userImage',
      maxCount: 1,
    }
    
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);







module.exports = router;
