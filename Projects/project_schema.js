const mongoose = require('mongoose');
const Task = require('./Tasks/task_schema');
const projectSchema = new mongoose.Schema({
    name: String,
    date: String,
    priorite: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

module.exports = mongoose.model("Project", projectSchema);
