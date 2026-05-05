const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    joiningDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
