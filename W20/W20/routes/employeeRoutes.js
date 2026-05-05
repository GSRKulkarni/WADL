const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const path = require('path');

// Serve the main HTML page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// GET all employees
router.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single employee by ID
router.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - Add a new employee
router.post('/api/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        salary: req.body.salary,
        joiningDate: req.body.joiningDate
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT - Update an existing employee
router.put('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (req.body.name) employee.name = req.body.name;
        if (req.body.department) employee.department = req.body.department;
        if (req.body.designation) employee.designation = req.body.designation;
        if (req.body.salary) employee.salary = req.body.salary;
        if (req.body.joiningDate) employee.joiningDate = req.body.joiningDate;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE - Delete an employee record
router.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
