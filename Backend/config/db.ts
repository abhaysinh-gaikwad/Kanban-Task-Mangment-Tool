import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.mongoURL || "";

const connection = mongoose.connect(mongoURL);


export default connection;
