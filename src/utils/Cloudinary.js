import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

    // console.log("file uploaded successfully", Response);

    fs.unlinkSync(localFilePath);
    return Response;
    
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default UploadFileToCloudinary;
