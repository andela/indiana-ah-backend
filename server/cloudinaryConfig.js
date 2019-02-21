import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


// module.exports = {
//   development: {
//     url: process.env.DATABASE_URL_DEV,
//     dialect: 'postgres'
//   },
//   test: {
//     url: process.env.DATABASE_URL_TEST,
//     dialect: 'postgres'
//   },
//   production: {
//     url: process.env.DATABASE_URL,
//     dialect: 'postgres'
//   }
// };

const storage = cloudinaryStorage({
  cloudinary,
  folder: '/images',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

const parser = multer({ storage });

export default parser;
