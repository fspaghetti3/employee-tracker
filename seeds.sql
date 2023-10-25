USE company_db;

INSERT INTO departments (name, description)
VALUES 
       ('Sales', 'Sells stuff'), 
       ('Engineering', 'Engineers Stuff'), 
       ('HR', 'HRs stuff');

INSERT INTO roles (title, salary, department_id) 
VALUES 
       ('Role Title 1', 50000, 1),
       ('Role Title 2', 60000, 2), 
       ('Role Title 3', 70000, 3), 
       ('Manager', 10000, 1);

INSERT INTO employees (first_name, last_name, role_title, manager_id)
VALUES ('Jonothan', 'Dober', 'Manager', NULL);


INSERT INTO employees (first_name, last_name, role_title, manager_id)
VALUES ('John', 'Doe', 'Role Title 1', 1), 
       ('Jane', 'Smith', 'Role Title 2', 1), 
       ('Emily', 'Johnson', 'Role Title 3', 1);