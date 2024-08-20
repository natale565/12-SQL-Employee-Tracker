

INSERT INTO departments (name) VALUES ('Engineering'), ('Sales');

INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1), 
('Sales Manager', 90000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Jim', 'Beam', 1, 1);  
