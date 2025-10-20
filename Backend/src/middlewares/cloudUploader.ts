import { v2 as cloudinary } from 'cloudinary';
import type { RequestHandler } from 'express';
import { CLOUD_NAME, API_KEY, API_SECRET } from '#config';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const cloudUploader: RequestHandler = async (request, response, next) => {
  const filepath = request.image!.filepath;

  const results = await cloudinary.uploader.upload(filepath);

  request.body.image = results.secure_url;

  next();
};

export default cloudUploader;
