const mongoose = require('mongoose');
const Task = require('./task_schema');
const User = require('./user_shemas');
const projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    date: String,
    priorite: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

module.exports = mongoose.model("Project", projectSchema);
