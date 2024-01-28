import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRATE,
});

const UploadFileToCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null;

    const Response = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: auto,
    });

    console.log("file uploaded successfully", Response);

    return Response;
  } catch (error) {
    fs.unlinkSync(LocalFilePath);
    return null;
  }
};

export default UploadFileToCloudinary;
