const mongoose = require("mongoose");
require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./../All_schema/user_shemas');
const Key = process.env.JWT_SECRET;
const RefreshKey = process.env.REFRESH_JWT_SECRET;
mongoose.connect("mongodb://127.0.0.1:27017/taskforge");
app.use(express.json());

const login = async (req, res, next) => {
    let check_case1;
    let check_case2;
    let take;
    let i;

    if (!(req.body.email && req.body.name && req.body.password))
        return res.send("The required information was not found");
    if (req.body.email != null) {
        check_case1 = User.findOne({ email: req.body.email, name: req.body.name});
        check_case1.then(user => {
            if (user) {
                i = 1;
                take = user;
            } else
		return res.send("Invalid informations");
        }).then(user => {
            if (i == 1) {
                let check = bcrypt.compare(req.body.password, take.password, (err, result) =>{
                    if (err) {
                        console.error('Error comparing:', err);
                        return;
                    }
                    if (result) {
                        const username = req.body.username;
                        const user = { name: username};
                        const token = jwt.sign(user, Key, {expiresIn: '1h'});
                        res.json({ accesstoken: token, id: take.id});
                    } else {
                        return res.send("Password does not match!\n Connexion failed");
                    }
                });
            }
        });
    }
};

const register = async (req, res) => {
    const oldEmail = await User.findOne({ email: req.body.email});
    const oldName = await User.findOne({ email: req.body.name});
    if (oldEmail || oldName) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const passw = req.body.password;
    const pasword = await bcrypt.hash(passw, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: pasword
    });
    try {
        const ad = await user.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

function verifytoken (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, Key, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        return next();
    });
};

async function getUser(req, res, next) {
    let subb;
    try {
        subb = await User.findById(req.params.id);
        if (subb == null)
            return res.status(404).json({message: 'Cannot find project'});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.subb = subb;
    next();
};

module.exports = {
    register: register,
    verifytoken: verifytoken,
    login: login,
    getUser: getUser
};
