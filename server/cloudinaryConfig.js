import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const configTestObj = {
  cloud_name: process.env.CLOUD_NAME_TEST,
  api_key: process.env.API_KEY_TEST,
  api_secret: process.env.API_SECRET_TEST
};

const configDevObj = {
  cloud_name: process.env.CLOUD_NAME_DEV,
  api_key: process.env.API_KEY_DEV,
  api_secret: process.env.API_SECRET_DEV
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
