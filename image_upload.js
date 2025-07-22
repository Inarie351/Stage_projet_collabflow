const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const multer = require('multer');
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});
const upload = multer({ storage: storage});
const express = require('express');
const app = express();
const Project = require('./All_schema/project_schema');
//mongoose.connect("mongodb://127.0.0.1:27017/taskforge");
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
    upload: upload,
};
