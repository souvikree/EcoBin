const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

                    // Register  //
//-----------------------------------------------------------------------------------
const registerUser = asyncHandler(async (req, res) => {
  // Extracting required fields
  const { userName, email, password } = req.body;

  // Validate required fields
  if (!userName || !userName.trim()) {
    throw new ApiError(400, "User Name can not be empty😢");
  }
  if (!email || !email.trim()) {
    throw new ApiError(400, "Email field can not be empty😢");
  }
  if (!password || !password.trim()) {
    throw new ApiError(400, "Please Enter Password😢");
  }
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists !!😒😒");
  }

  // Handle file upload
  let userImageLocalPath;
  if (req.files && req.files.userImage && req.files.userImage.length > 0) {
    userImageLocalPath = req.files.userImage[0].path;
  }
  const userImageCloudinary = await uploadOnCloudinary(userImageLocalPath);

  // Create new user
  const newUser = new User({
    userName,
    email,
    password,
    userImage: userImageCloudinary?.url || "",
  });

  await newUser.save();

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    newUser._id
  );

  return res.status(201).json(
    new ApiResponse(201, {
      message: "User registered successfully😍😍",
      accessToken,
      refreshToken,
      user: {
        userName: newUser.userName,
        email: newUser.email,
        userImage: newUser.userImage,
      },
    })
  );
});
                        // Login //
//-------------------------------------------------------------------------------------
                            
const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  //console.log(email);

  if (!userName && !email) {
    throw new ApiError(400, "username or email is required 😢😢");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist 😒😒");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user Password 😥😥");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully 😍😍"
      )
    );
});
                            // logout //
//-------------------------------------------------------------------------------------
                            
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out😢😢"));
});

//-------------------------------------------------------------------------------------




// This is middleware part
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
module.exports = { registerUser, loginUser, logoutUser };
