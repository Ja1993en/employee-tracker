import inquirer from "inquirer";
import cTable from 'console.table';
import mysql from 'mysql2';

// Establish connection to your db from your local computer
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

//   Function to initiate the app
  const startApp = async () => {

    // User options
    const options = [
      {
        type: 'rawlist',
        name: 'options',
        message: 'What do you want to do?',
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "Quit"]
      }]

    // Users selected option 
    const selectedOpt = await inquirer.prompt(options)
  
    // Calls appropriate function 
    switch (selectedOpt.options) {
      case "view all departments":
        allDepartments();
        break;
      case "view all roles":// Value of foo matches this criteria; execution starts from here
        allRoles();
        break;
      case "view all employees": // no break statement in 'case 0:' so this case will run as well
        allEmployees();
        break; // Break encountered; will not continue into 'case 2:'
      case "add a department":
        addDepartment();
        break;
      case "add a role":
        addRole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee role":
        updateEmployee()
        break;
      case "Quit":
        db.end();
        break;
    }
   
  }

  //Displays all departments in a table
  const allDepartments = async () => {
    db.query("SELECT id, name FROM department", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      startApp()
    });
  }

// Displays all roles in a table
  const allRoles = async () => {
    db.query("SELECT roles.id, roles.title, department.name, roles.salary FROM roles JOIN department ON roles.department_id = department.id;", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      startApp()
    })
  }

// Displays all employees
  const allEmployees = async () => {
    db.query(`SELECT 
      e.id AS employee_id,
      e.first_name,
      e.last_name,
      r.title AS role_title,
      d.name AS department_name,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM employee AS e
    INNER JOIN roles AS r ON e.role_id = r.id
    INNER JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id;`, function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      startApp()
    });
}


// Add department to db
const addDepartment = async () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'department',
          message: 'What is the department name ',
        }
      ])
      .then((res) => {
        
  
        db.query(`INSERT INTO department (name) VALUES ("${res.department}")`, function (err, result, fields) {
          if (err) throw err;
          startApp()
        })
      })
  }

  // Adds role to db
  const addRole = async () => {

    db.query(`SELECT * FROM department`, function (err, result, fields) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'role',
            message: `What is the name of the role`,
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role ',
          },
          {
            type: 'rawlist',
            name: 'department',
            message: 'What department does the role belong to ',
            choices: result.map(arr => arr.name),
          }
        ])
        .then((answer) => {
          const founddpt = result.find(dpt => dpt.name === answer.department)
  
          db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${answer.role}",  ${answer.salary}, ${founddpt.id} );`, function (err, result, fields) {
            if (err) throw err;
            startApp()
          })
        })
    })
  }

  //Add employee to db
  const addEmployee = async () => {
    db.query("SELECT * FROM roles ", function (err, roles, fields) {
      if (err) throw err;
  
      db.query(`SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS manager  FROM employee e `, function (err, employees, fields) {
        if (err) throw err;
  
       const managerOpt = employees.map(arr => arr.manager)
       managerOpt.unshift("None")
  
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'What is first name of the employee',
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'What is the last name of the employee ',
            },
            {
              type: 'rawlist',
              name: 'title',
              message: 'What role does this employee belongs to ?',
              choices: roles.map(arr => arr.title)
            },
            {
              type: 'rawlist',
              name: 'manager',
              message: 'who is the employees manager ?',
              choices: managerOpt
            },
          ])
          .then((res) => {
  
            const foundRole = roles.find(roles => roles.title == res.title);
  
            if(res.manager.toLowerCase() === "none"){
              console.log(res.manager)
              res.manager = null
              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}",  "${res.last_name}", ${foundRole.id}, ${res.manager});`, function (err, result, fields) {
                if (err) throw err;
                startApp()
              })
  
            } else{
            const foundManager = employees.find(employee => employee.manager == res.manager)
            
  
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}",  "${res.last_name}", ${foundRole.id}, ${foundManager.id});`, function (err, result, fields) {
              if (err) throw err;
              startApp()
            })
            }
          })
      })
    })
  }


const updateEmployee = async () => {
    db.query(`SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name  FROM employee e `, function (err, employees, fields) {
      if (err) throw err;
      // console.log(result);
      db.query(`SELECT r.id, r.title FROM roles r`, function (err, roles, fields) {
  
        inquirer
        .prompt([
          {
            type: 'rawlist',
            name: 'employee',
            message: `Which employee's role you want to update?`,
            choices: employees.map(arr => arr.name)
          },
          {
            type: 'rawlist',
            name: 'roleOpt',
            message: `Which role do you want to assign to the selected employee`,
            choices: roles.map(arr => arr.title)
          },
        ])
        .then((res) => {
          const foundEmp = employees.find(emp => emp.name == res.employee)
          const foundRole = roles.find( role => role.title == res.roleOpt)
          foundEmp.id
          console.log(foundRole)
  
          db.query(`UPDATE employee SET role_id = ${foundRole.id} WHERE id = ${foundEmp.id};`, function (err, result, field) {
            if (err) throw err;
            console.log(result)
          })
        })
  
  
  
      })
    })
  }
  startApp();