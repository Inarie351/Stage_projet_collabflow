const mongoose = require("mongoose");
const express = require('express');
const app = express();
const Task = require('./../All_schema/task_schema');
mongoose.connect("mongodb://127.0.0.1:27017/taskforge");
app.use(express.json());

const addTasks = async (req, res) => {
    let ad;
    const task = new Task({
        titre: req.body.titre,
        status: req.body.status,
        priorite: req.body.priorite
    });
    try {
        ad = await task.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
    res.subb.tasks = await res.subb.updateOne({ $push: { tasks: ad.id}});
    try {
        const update = await res.subb.save();
        res.json(update);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
};

const update = async (req, res) => {
    if (req.body.titre != null) {
        res.sub.titre = req.body.titre;
    }
    if (req.body.status != null) {
        res.sub.status = req.body.status;
    }
    if (req.body.priorite != null) {
        res.sub.priorite = req.body.priorite;
    }
    try {
        const updat = await res.sub.save();
        res.json(updat);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
};

const deleted =	async (req, res) => {
    const id = req.params.id;
    try {
        const del = await Task.findByIdAndDelete(id);
        res.json({ message: 'Delete Task'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

async function getTask(req, res, next) {
    let sub;
    try {
        sub = await Task.findById(req.params.id);
        if (sub == null)
            return res.status(404).json({message: 'Cannot find project'});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.sub = sub;
    next();
};

module.exports = {
    getTask: getTask,
    deleteTask: deleted,
    update: update,
    addTasks: addTasks
};
