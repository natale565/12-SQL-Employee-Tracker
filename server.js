const inquirer = require("inquirer");
const express = require("express");
const pool = require('./database');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
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
        case 'Delete a department':
            deleteDepartment();
            break;
        case 'Delete a role':
            deleteRole();
            break;
        case 'Delete an employee':
            deleteEmployee();
            break;
        case 'Exit':
            pool.end();
            process.exit();
    }
};


const viewDepartments = () => {
    pool.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        console.table(results.rows);
        mainMenu();
    });
};

const viewRoles = () => {
    pool.query(`
        SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        JOIN departments ON roles.department_id = departments.id
    `, (err, results) => {
        if (err) throw err;
        console.table(results.rows);
        mainMenu();
    });
};

const viewEmployees = () => {
    pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        JOIN departments d ON r.department_id = d.id
        LEFT JOIN employees m ON e.manager_id = m.id
    `, (err, results) => {
        if (err) throw err;
        console.table(results.rows);
        mainMenu();
    });
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    });

    pool.query('INSERT INTO departments (name) VALUES ($1)', [name], (err, results) => {
        if (err) throw err;
        console.log('Department added!');
        mainMenu();
    });
};

const addRole = async () => {
    const departments = await getDepartments();

    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
        { type: 'list', name: 'department_id', message: 'Select the department for this role:', choices: departments }
    ]);

    pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id], (err, results) => {
        if (err) throw err;
        console.log('Role added!');
        mainMenu();
    });
};

const addEmployee = async () => {
    const roles = await getRoles();
    const managers = await getEmployees();

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the employee’s first name:' },
        { type: 'input', name: 'last_name', message: 'Enter the employee’s last name:' },
        { type: 'list', name: 'role_id', message: 'Select the role for this employee:', choices: roles },
        { type: 'list', name: 'manager_id', message: 'Select the manager for this employee:', choices: managers }
    ]);

    pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
    [first_name, last_name, role_id, manager_id || null], (err, results) => {
        if (err) throw err;
        console.log('Employee added!');
        mainMenu();
    });
};

const updateEmployeeRole = async () => {
    const employees = await getEmployees();
    const roles = await getRoles();

    const { employee_id, role_id } = await inquirer.prompt([
        { type: 'list', name: 'employee_id', message: 'Select the employee to update:', choices: employees },
        { type: 'list', name: 'role_id', message: 'Select the new role for this employee:', choices: roles }
    ]);

    pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id], (err, results) => {
        if (err) throw err;
        console.log('Employee role updated!');
        mainMenu();
    });
};

const getDepartments = () => new Promise((resolve, reject) => {
    pool.query('SELECT id, name FROM departments', (err, results) => {
        if (err) return reject(err);
        resolve(results.rows.map(dept => ({ name: dept.name, value: dept.id })));
    });
});

const getRoles = () => new Promise((resolve, reject) => {
    pool.query('SELECT id, title FROM roles', (err, results) => {
        if (err) return reject(err);
        resolve(results.rows.map(role => ({ name: role.title, value: role.id })));
    });
});

const getEmployees = () => new Promise((resolve, reject) => {
    pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees', (err, results) => {
        if (err) return reject(err);
        resolve(results.rows.map(emp => ({ name: emp.name, value: emp.id })));
    });
});

const deleteDepartment = async () => {
    const departments = await getDepartments();

    const {department_id} = await inquirer.prompt({
        type: 'list',
        name: 'department_id',
        message: 'Select the department to delete',
        choices: departments
    });

    pool.query('DELETE FROM departments WHERE id = $1', [department_id], (err, results) => {
        if (err) throw err;
        console.log('Department deleted!');
        mainMenu();
    });
};

const deleteRole = async () => {
    const roles = await getRoles();

    const { role_id } = await inquirer.prompt({
        type: 'list',
        name: 'role_id',
        message: 'Select the role to delete:',
        choices: roles
    });

    pool.query('DELETE FROM roles WHERE id = $1', [role_id], (err, results) => {
        if (err) throw err;
        console.log('Role deleted!');
        mainMenu();
    });
};

const deleteEmployee = async () => {
    const employees = await getEmployees();

    const { employee_id } = await inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to delete:',
        choices: employees
    });

    pool.query('DELETE FROM employees WHERE id = $1', [employee_id], (err, results) => {
        if (err) throw err;
        console.log('Employee deleted!');
        mainMenu();
    });
};



mainMenu();

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
