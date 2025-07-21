const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    titre: String,
    status: String,
    priorite: String
});

module.exports = mongoose.model("Task", taskSchema);
