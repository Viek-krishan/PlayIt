import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRATE,
});

const UploadFileToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const Response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    const resp = await cloudinary.uploader.fs // console.log("file uploaded successfully", Response);
      // unlinkSync(localFilePath);
    return Response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const DeleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) throw new ApiError(400, "file url is important");

  const Response = await cloudinary.uploader
    .destroy(fileUrl)
    .then(function (result) {
      console.log(result);
    });

  return Response;
};

export { UploadFileToCloudinary, DeleteFileFromCloudinary };
