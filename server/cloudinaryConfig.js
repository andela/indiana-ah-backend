import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const configTestObj = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
};

const configDevObj = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
};

cloudinary.config(process.env.NODE_ENV === 'development' ? configDevObj : configTestObj);

const storage = cloudinaryStorage({
  cloudinary,
  folder: '/images',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

const parser = multer({ storage });

export default parser;
