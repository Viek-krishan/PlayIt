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
  const coverImageLocalPath = req.files.coverImage[0]?.path;

  if (!avatarLocalPath)
    throw new ApiError(400, "Avatar is required. Please upload");

  const Avatar = await UploadFileToCloudinary(avatarLocalPath);
  const CoverImage = await UploadFileToCloudinary(coverImageLocalPath);

  if (!Avatar)
    throw new ApiError(
      400,
      "Something went wrong with Avatar!!, Please upload once again"
    );

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.lowerCase(),
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

export default RegisterUser;
