import mongoose, { get, isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { response } from "express";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { username } = req.params;
  // TODO: toggle subscription

  if (!username) throw new ApiError(404, "channel Id is required");

  const user = await fetch(
    `https://localhost:3000/api/v1/user/get-user-channel/${username}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      throw new ApiError(400, error);
    });

  if (!user) throw new ApiError(404, "user not found");

  if (!user.isSubscribed) {
    user.isSubscribed = true;
  } else {
    user.isSubscribed = false;
  }

  user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Subscription toggle successful"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) throw new ApiError(404, "channel Id is required");

  const user = await fetch(
    `https://localhost:3000/api/v1/user/get-user-channel/${username}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      throw new ApiError(400, error);
    });

  if (!user) throw new ApiError(404, "user not found");

  return res
    .status(200)
    .json(
      200,
      { subscriberCount: user.subscriberCount },
      "Subscriber count fetched successfully"
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
