import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const duration = { expiresIn: '24hrs' };
const secretKey = process.env.JWT_SECRET_KEY;
const assignToken = payload => jwt.sign(payload, secretKey, duration);

export default assignToken;
