INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");


INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead",100000, 4),
        ("Salesperson",80000, 4),
        ("Lead Engineer",150000, 1),
        ("Software Engineer" , 120000, 1),
        ("Account Manager",1600000, 2),
        ("Accountant",125000, 2),
        ("Legal Team Lead", 250000, 3),
        ("Lawyer", 250000, 3);

INSERT INTO employee (  first_name,last_name, role_id, manager_id) 
VALUES  ("Jalen", "Mcneal", 3 , NULL),
		("Future", "Hendrix", 1 , 1),
        ("Michael", "Woods", 2 , NULL),
        ("Travon", "White", 4 , 2),
        ("Jamison", "White", 5 , NULL),
        ("Angel" , "White", 6, 3 ),
        ("Spencer", "James", 7, NULL),
        ( "Bosquit", "Jean ", 8, 4)
