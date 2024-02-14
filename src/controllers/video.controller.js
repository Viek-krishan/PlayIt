import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  UploadFileToCloudinary,
  DeleteFileFromCloudinary,
} from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!description) {
    throw new ApiError(400, "description is required");
  }

  // console.log(req.files);

  const videoLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail, both are required");
  }

  const VideoFile = await UploadFileToCloudinary(videoLocalPath);
  const Thumbnail = await UploadFileToCloudinary(thumbnailLocalPath);

  if (!VideoFile) {
    throw new ApiError(
      500,
      "something went wrong while uploading video file... Please try again"
    );
  }

  if (!Thumbnail) {
    throw new ApiError(
      500,
      "something went wrong while uploading Thumbnail... Please try again"
    );
  }

  const video = await Video.create({
    videoFile: VideoFile.url,
    videoFilePublicId: VideoFile.public_id,
    thumbnail: Thumbnail.url,
    thumbnailPublicId: Thumbnail.public_id,
    title,
    description,
    duration: VideoFile.duration,
    owner: req.user._id,
  });

  const uploadedVideo = await Video.findById(video._id);

  if (!uploadedVideo) {
    throw new ApiError(
      500,
      "Something went wrong while video instance creating... Please try again"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { uploadedVideo }, "Video uploaded successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId) {
    throw new ApiError(400, "Video Id not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(401, "Video not found !");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { toUpdate, data, isThumbnail } = req.body;

  if (!videoId) {
    throw new ApiError(401, "video Id not found");
  }

  if (!toUpdate || !data) {
    throw new ApiError(401, "All fields are required");
  }

  // if (typeof data != "String") {
  //   throw new ApiError(406, "Data field must be string.");
  // }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found !!!");
  }

  if (toUpdate === "title") {
    video.title = data;
    await video.save();
  } else if (toUpdate === "description") {
    video.title = data;
    await video.save();
  } else {
    throw new ApiError(400, "toUpdate field is wrong. Please check and retry");
  }

  //   Thumbnail updation logics
  if (isThumbnail != "false") {
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath)
      throw new ApiError(404, "Thumbnail file not found");

    const Thumbnail = await UploadFileToCloudinary(thumbnailLocalPath);

    if (!Thumbnail) {
      throw new ApiError(
        501,
        "Failed to upload the thumbnail !!! Please try again"
      );
    }

    // How to delete the previous file from cloudinary
    if (video.thumbnailPublicId) {
      const thumbnailDeletedResponse = await DeleteFileFromCloudinary(
        video.thumbnailPublicId,
        "image"
      );

      for (const key in thumbnailDeletedResponse.deleted) {
        if (thumbnailDeletedResponse.deleted[key] != "deleted") {
          throw new ApiError(400, "thumbnail deletion failed");
        }
      }
    }

    video.thumbnail = Thumbnail.url;
    video.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { isThumbnail }, "video updation successfull"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId) throw new ApiError(404, "Video Id not found");

  const video = await Video.findById(videoId);

  if (!video)
    throw new ApiError(
      404,
      "Video Id is doesn't exist !!! Please check and retry"
    );

  const videoDeletedResponse = await DeleteFileFromCloudinary(
    video.videoFilePublicId,
    "video"
  );
  const thumbnailDeletedResponse = await DeleteFileFromCloudinary(
    video.thumbnailPublicId,
    "image"
  );

  for (const key in videoDeletedResponse.deleted) {
    if (videoDeletedResponse.deleted[key] != "deleted") {
      throw new ApiError(400, "Video deletion failed");
    }
  }

  for (const key in thumbnailDeletedResponse.deleted) {
    if (thumbnailDeletedResponse.deleted[key] != "deleted") {
      throw new ApiError(400, "thumbnail deletion failed");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videoDeletedResponse, thumbnailDeletedResponse },
        " Deletion successful"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(404, "Video Id not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video doesn't exist");
  }

  if (video.isPublished) video.isPublished = true;
  else video.isPublished = false;

  video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        "isPublished toggled successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
