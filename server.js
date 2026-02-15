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
  startApp();