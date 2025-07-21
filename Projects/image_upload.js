const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const app = express();
const Project = require('./../All_schema/project_schema');
mongoose.connect("mongodb://127.0.0.1:27017/taskforge");
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imagePath) {
      try {
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'my_uploads',
        });
        console.log('Image uploaded successfully:', result.url);
        return result.url;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
};

const storage =  new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'your_upload_folder',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        },
});

const upload = multer({ storage: storage});

const profile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        } else
	    res.subb.image = req.file.path;
        res.status(200).json({
            message: 'File uploaded successfully!',
            //res.subb.image = req.file.path
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file.' });
    }
    try {
        const update = await res.subb.save();
        res.json(update);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
};

module.exports = {
    profile: profile,
    upload: upload
};
