import { v2 as cloudinary } from 'cloudinary';
import type { RequestHandler } from 'express';
import { CLOUD_NAME, API_KEY, API_SECRET } from '#config';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const cloudUploader: RequestHandler = async (request, response, next) => {
  let uploadedFiles = [];

  const fileArray = request.pictureURL;

  if (!fileArray) throw new Error('please upload the pictures', { cause: { status: 400 } });

  for (const file of fileArray) {
    const results = await cloudinary.uploader.upload(file.filepath);

    uploadedFiles.push(results.secure_url);

    // console.log(uploadedFiles);
  }

  request.body.pictureURL = uploadedFiles;

  next();
};

export default cloudUploader;
