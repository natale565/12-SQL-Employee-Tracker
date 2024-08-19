const inquirer = require("inquirer");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Add employee
app.post('/api/new-employee', ({ body }, res) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES ($1)`;
    const params = [body.first_name, body.last_name];
  
    pool.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });
  
  // View all employees
  app.get('/api/employees', (req, res) => {
    const sql = `SELECT * FROM employees`;
  
    pool.query(sql, (err, { rows }) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });
  
  // Delete an employee
  app.delete('/api/employees/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = $1`;
    const params = [req.params.id];
  
    pool.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: err.message });
      } else if (!result.rowCount) {
        res.json({
          message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.rowCount,
          id: req.params.id
        });
      }
    });
  });

function chooseAction(){
    inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: ['View All Employees','Add Employee','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department','Quit'],
    }
    ]).then (function(answers) {
      console.log(answers);
    })
  }
   chooseAction()

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "employeeRole",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
          "Customer Service",
        ],
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "employeeManager",
        choices: [
          "None",
          "Chris",
          "John",
          "Mary",
          "Kelly",
          "Kim",
        ],
      },
    ])
    .then(function (answers) {
      console.log(answers);
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "role",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "salary",
      },
    ])
    .then(function (answers) {
      console.log(answers);
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "department",
      },
    ])
    .then(function (answers) {
      console.log(answers);
    });
}


app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });