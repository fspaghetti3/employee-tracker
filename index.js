const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./queries')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fred1231',
    database: 'company_db'
});

function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                connection.end();
        }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

// Implement Functions

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the company_db database.');
    mainMenu();
});