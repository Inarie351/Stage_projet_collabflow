const mongoose = require('mongoose');
const Project = require('./project_schema');
const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, index: {unique: true}},
    password: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
});

module.exports = mongoose.model("User", userSchema);
