const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const multer = require('multer');
//const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./All_schema/user_shemas');
const Task = require('./All_schema/task_schema');
const Project = require('./All_schema/project_schema');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;
const Key = process.env.JWT_SECRET;
const RefreshKey = process.env.REFRESH_JWT_SECRET;
mongoose.connect("mongodb+srv://kimeldiedegnon:OM5aQ9kb5V3saYgB@cluster0.wdhst2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
app.use(express.json());
const { getTask, deleteTask, update, addTasks } = require('./Tasks/create_tasks');
const { getUser, register, verifytoken, login } = require('./User/user_create_and_connexion');
const { addMember,
	getProjects,
	deleteProjects,
	updateProjects,
	addProjects } = require('./Projects/create_projects');
const { upload } = require('./image_upload');
app.get('/connection', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', () => {
    console.log('New user connected');
    socket.emit('newMessage', { from: 'Server', text: 'Welcome!', createdAt: Date.now()});
    socket.on('createMessage', (message) => {
	console.log('New message:', message);
	io.emit('newMessage', message);
    });
    socket.on('disconnect', () => {
	console.log('User disconnected');
    });
});

app.post('/profile/:id', getProjects, upload.single('image'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
	const result = await cloudinary.uploader.upload(req.file.path, {
	    resource_type: 'image'});
	res.subb.image = result.url;
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading image.');
    }
    try {
        console.log("I'm there");
        const update =  await res.subb.save();
        res.json(update);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

app.get('/posts', verifytoken, (req, res) => {
    console.log(req.user);
    res.json({message: 'Access granted for user'});
});

app.get('/', (req, res) => {
    console.log('Hello world');
    res.send('Done');
});

app.post('/register', register);

app.post('/login', login);

app.post('/addMember/:id', getProjects, addMember);

app.post('/addTasks/:id', getProjects, addTasks);

app.delete('/deleteTask/:id', deleteTask);

app.patch('/Tasks/:id', getTask, update);

app.post('/addProjects/:id', getUser, addProjects);

app.delete('/deleteProjects/:id/', getProjects, deleteProjects);

app.patch('/Projects/:id/:name', getProjects, updateProjects);

app.listen(3000, () => {
  console.log('Hey!');
});
