const mongoose = require("mongoose");
const express = require('express');
const app = express();
const User = require('./../All_schema/user_shemas');
const Project = require('./../All_schema/project_schema');
mongoose.connect("mongodb+srv://kimeldiedegnon:OM5aQ9kb5V3saYgB@cluster0.wdhst2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
app.use(express.json());

const addProjects = async (req, res) => {
    let ad;
    const project = new Project({
	name: req.body.name,
        date: req.body.date,
        priorite: req.body.priorite

    });
    project.admin = res.subb.id;
    try {
        ad = await project.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
    res.subb.projects = await res.subb.updateOne({ $push: { projects: ad.id}});
    try {
        const update = await res.subb.save();
        res.json(update);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
};

const addMember = async (req, res) => {
    let projects;
    let take;
    const member = User.findOne({ name: req.body.name});
    member.then (async (user) => {
	if (user) {
	    projects = res.subb;
	    take = projects.members;
	    for (let i in take) {
		const ne = take[i].toString();
		if (user.id == ne)
		    return ;
	    }
	    res.subb.members = await projects.updateOne({ $push: { members: user.id}});
	} else
	    return res.send("User not find");
    });
    try {
        const update = await res.subb.save();
        res.json(update);
    } catch (err) {
	res.status(400).json({ message: err.message});
    }
};

const updateProjects = async (req, res) => {
    const admins = res.subb.admin.toString();
    const find =  User.findOne({ name: req.params.name});
    find.then(async (user) => {
	if (user && admins == user.id) {
	    if (req.body.name != null) {
        res.subb.name = req.body.name;
    }
    if (req.body.date != null) {
        res.subb.date = req.body.date;
    }
    if (req.body.priorite != null) {
        res.subb.priorite = req.body.priorite;
    }
	} else {
	    const send = "User is not admin";
	    res.json(send);
	}
    try {
        const updat = await res.subb.save();
        res.json(updat);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
    });
};

const deleted = async (req, res) => {
    const id = req.params.id;
    let admin = res.subb.admin.toString();
    const find = User.findOne({ name: req.body.name});
    find.then(async (user) => {
	if (user && admin == user.id) {
	   /* const str = user.projects;
	    for (let i in str) {
		if (str[i].toStrings == id)
		    str = str.filter(item => item != id);
	    }*/
	    try {
		//const sav = await str.save();	    
        const del = await Project.findByIdAndDelete(id);
        res.json({ message: 'Delete Project'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
	} else {
	    const send = "User is not admin";
            res.json(send);
	}
    });
};

async function getProject(req, res, next) {
    let subb;
    try {
        subb = await Project.findById(req.params.id);
        if (subb == null)
            return res.status(404).json({message: 'Cannot find project'});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.subb = subb;
    next();
};

module.exports = {
    deleteProjects: deleted,
    updateProjects: updateProjects,
    addProjects: addProjects,
    getProjects: getProject,
    addMember: addMember
};
