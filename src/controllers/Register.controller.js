import asyncHandeler from "../utils/asyncHandeler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import UploadFileToCloudinary from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const RegisterUser = asyncHandeler(async (req, res) => {
  /*fetch data from frontend
		  check for validation
		  check if user already exist
		  check for file, avatar
		  check for file upload process, cloudinary
		  create new user obj
		  remove password and refresh tokens from response
		  check for user creation
		  res.send( user )
		  */

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field are required");
  }

  if (!email.includes("@")) throw new ApiError(400, "Please enter valid email");

  const ExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (ExistedUser)
    throw new ApiError(400, "Given username or email is already registered");

  const avatarLocalPath = req.files.avatar[0]?.path;
  // const coverImageLocalPath = req.files.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
    // console.log(coverImageLocalPath);
  }

  if (!avatarLocalPath)
    throw new ApiError(400, "Avatar is required. Please upload");

  const Avatar = await UploadFileToCloudinary(avatarLocalPath);
  const CoverImage = await UploadFileToCloudinary(coverImageLocalPath);

  if (!Avatar)
    throw new ApiError(
      401,
      "Something went wrong with Avatar!!, Please upload once again"
    );

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    avatar: Avatar.url,
    coverImage: CoverImage?.url || "",
  });

  const CreatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!CreatedUser)
    throw new ApiError(500, "Something went wrong while user registration");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        CreatedUser,
        "User registration completed successfully"
      )
    );
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const AccessToken = await user.GenerateAccessToken();
    const RefreshToken = await user.GenerateRefreshToken();

    user.refreshToken(RefreshToken);
    user.save();

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const LogInUser = asyncHandeler(async (req, res) => {
  /*
	    1. get the logIn data from req.body - username, email, password
	    2. check for the authentication data
	    3. check if the user is available or not
	    4. check for password
	    5. generate refresh & access tokens
	    6 give response
	    */

  const { email, username, password } = req.body;

  if (!(email || username))
    throw ApiError(401, "Eigther Username or email is required");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(404, "Provided username or email not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: logedInUser,
          RefreshToken,
          AccessToken,
        },
        "User Loged In successfully"
      )
    );
});

const LogOutUser = asyncHandeler(async (req, res) => {
  await User.findOneAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options);
});

export { RegisterUser, LogInUser, LogOutUser };
