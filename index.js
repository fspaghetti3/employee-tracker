const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./queries')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fred1231',
    database: 'company_db'
});

const asciiArt = 

` 
 /$$$$$$$$                      /$$                                           /$$$$$$$$                       /$$                        
| $$_____/                     | $$                                          |__  $$__/                      | $$                        
| $$      /$$$$$$/$$$$  /$$$$$$| $$ /$$$$$$ /$$   /$$ /$$$$$$  /$$$$$$          | $$ /$$$$$$ /$$$$$$  /$$$$$$| $$   /$$ /$$$$$$  /$$$$$$ 
| $$$$$  | $$_  $$_  $$/$$__  $| $$/$$__  $| $$  | $$/$$__  $$/$$__  $$         | $$/$$__  $|____  $$/$$_____| $$  /$$//$$__  $$/$$__  $$
| $$__/  | $$ \ $$ \ $| $$  \ $| $| $$  \ $| $$  | $| $$$$$$$| $$$$$$$$         | $| $$  \__//$$$$$$| $$     | $$$$$$/| $$$$$$$| $$  \__/
| $$     | $$ | $$ | $| $$  | $| $| $$  | $| $$  | $| $$_____| $$_____/         | $| $$     /$$__  $| $$     | $$_  $$| $$_____| $$      
| $$$$$$$| $$ | $$ | $| $$$$$$$| $|  $$$$$$|  $$$$$$|  $$$$$$|  $$$$$$$         | $| $$    |  $$$$$$|  $$$$$$| $$ \  $|  $$$$$$| $$      
|________|__/ |__/ |__| $$____/|__/\______/ \____  $$\_______/\_______/         |__|__/     \_______/\_______|__/  \__/\_______|__/      
                      | $$                  /$$  | $$                                                                                    
                      | $$                 |  $$$$$$/                                                                                    
                      |__/                  \______/                                                                                     `

function mainMenu() {
    console.log(asciiArt)
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

function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

function addEmployee() {

    connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) throw err;

        connection.query("SELECT id, first_name, last_name FROM employees WHERE role_title = 'Manager'", (err, managers) => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the employee's first name:"
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter the employee's last name:"
        },
        {
            name: "role_title",
            type: "list",
            message: "Enter the employee's role ID:",
            choices: roles.map(role => role.title)
        },
        {
            name: "manager_id",
            type: "list",
            message: "Enter the manager ID for this employee (or leave blank if none):",
            choices: managers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value:  manager.id.toString()
            })).concat([{name: 'None', value: null}])
        }
    ]).then(answers => {
        connection.query(
            'INSERT INTO employees (first_name, last_name, role_title, manager_id) VALUES (?, ?, ?, ?)', 
            [answers.first_name, answers.last_name, answers.role_title, answers.manager_id || null],
            (err, results) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                mainMenu();
            }
        );
    });
  });
});
}

function addRole() {

    connection.query('SELECT * FROM departments', (err, departments) => {
        if (err) throw err;


        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Enter the name for the role you'd like to add:",
            },
            {
                name: "department_id",
                type: "list",
                message: "Select the department the role is involved in:",
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            },
            {
                name: "salary",
                type: "input",
                message: "What is the roles salary?",
                default: null
            }
        ]).then(answers => {
            connection.query('INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)', 
                [answers.title, answers.department_id, answers.salary || null], 
                (err, results) => {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    mainMenu();
            });
        });
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the name of the department:"
        },
        {
            name: "description",
            type: "input",
            message: "Enter a brief description of the department:",
            default: null
        }
    ]).then(answers => {
        connection.query('INSERT INTO departments (name, description) VALUES (?, ?)', 
            [answers.name, answers.description || null], 
            (err, results) => {
                if (err) throw err;
                console.log('Department added successfully!');
                mainMenu();
        });
    });
}

function updateEmployeeRole() {

    connection.query('SELECT id, first_name, last_name FROM employees', (err, employees) => {
        if (err) throw err;
        
        inquirer.prompt([
            {
                name: "employeeId",
                type: "list",
                message: "Which employee would you like to select?",
                choices: employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]).then(answers => {
            const selectedEmployeeId = answers.employeeId;
            
            connection.query('SELECT id, title FROM roles', (err, roles) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        name: "roleTitle",
                        type: "list",
                        message: "Which role would you like to assign to the selected employee?",
                        choices: roles.map(role => ({
                            name: role.title,
                            value: role.title
                        }))
                    }
                ]).then(answers => {
                    const newRoleTitle = answers.roleTitle;   
 
                    connection.query('UPDATE employees SET role_title = ? WHERE id = ?', [newRoleTitle, selectedEmployeeId], (err, results) => {
                        if (err) throw err;
                        console.log("Employee role updated successfully!");
                        mainMenu();
                    });
                });
            });
        });
    });
}

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the company_db database.');
    mainMenu();
});