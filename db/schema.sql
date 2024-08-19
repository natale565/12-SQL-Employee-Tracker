DROP DATABASE IF EXISTS employee_info_db;

CREATE DATABASE employee_info_db;

USE employee_info_db;

CREATE TABLE departments (
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE roles (
  id SERIAL NOT NULL,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id)
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
  id SERIAL NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);
