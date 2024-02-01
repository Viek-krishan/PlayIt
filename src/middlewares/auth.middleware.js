import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import asyncHandeler from "../utils/asyncHandeler";
import jwt from "jsonwebtoken";

export const VerifyUser = asyncHandeler(async (req, res, next) => {
  try {
    const token =
      req.cookies.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const DecodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE);

    const user = User.findById(DecodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(400, "Invalid Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Token");
  }
});
