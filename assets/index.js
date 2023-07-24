import inquirer from "inquirer";
import connection from "../db/connection.js";
import chalk from "chalk";

async function mainMenu() {
  const answer = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  });

  switch (answer.action) {
    case "View all departments":
      await viewDepartments();
      break;
    case "Add a department":
      await addDepartment();
      break;
    case "View all roles":
      await viewRoles();
      break;
    case "Add a role":
      await addRole();
      break;
    case "View all employees":
      await viewEmployees();
      break;
    case "Add an employee":
      await addEmployee();
      break;
    case "Update an employee role":
      await updateEmployeeRole();
      break;
    case "Exit":
      connection.end();
      break;
    default:
      console.log(chalk.red(`Invalid action: ${answer.action}`));
      break;
  }
}

async function viewDepartments() {
  const query = "SELECT * FROM department";
  const [rows] = await connection.promise().query(query);
  console.table(rows);
  await mainMenu();
}

async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "name",
    type: "input",
    message: "What is the name of the department?",
  });

  const query = "INSERT INTO department (name) VALUES (?)";
  await connection.promise().query(query, answer.name);
  await mainMenu();
}

async function viewRoles() {
  const query = "SELECT * FROM role";
  const [rows] = await connection.promise().query(query);
  console.table(rows);
  await mainMenu();
}

async function addRole() {
  const answer = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What is the title of the role?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the role?",
    },
    {
      name: "department_id",
      type: "input",
      message: "What is the department ID of the role?",
    },
  ]);

  const query =
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
  await connection
    .promise()
    .query(query, [answer.title, answer.salary, answer.department_id]);
  await mainMenu();
}

async function viewEmployees() {
  const query = "SELECT * FROM employee";
  const [rows] = await connection.promise().query(query);
  console.table(rows);
  await mainMenu();
}

async function addEmployee() {
  const answer = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the first name of the employee?",
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the last name of the employee?",
    },
    {
      name: "role_id",
      type: "input",
      message: "What is the role ID of the employee?",
    },
    {
      name: "manager_id",
      type: "input",
      message:
        "What is the manager ID of the employee? Enter 0 if the employee has no manager.",
    },
  ]);

  // Check if the role exists in the database
  const roleQuery = "SELECT * FROM role WHERE id = ?";
  const [roleRows] = await connection
    .promise()
    .query(roleQuery, answer.role_id);

  if (roleRows.length === 0) {
    console.log(chalk.red(`Role with ID ${answer.role_id} does not exist.`));
    await mainMenu();
    return;
  }

  // Check if the manager exists in the database, unless the manager_id is 0
  if (answer.manager_id !== "0") {
    const managerQuery = "SELECT * FROM employee WHERE id = ?";
    const [managerRows] = await connection
      .promise()
      .query(managerQuery, answer.manager_id);

    if (managerRows.length === 0) {
      console.log(
        chalk.red(`Manager with ID ${answer.manager_id} does not exist.`)
      );
      await mainMenu();
      return;
    }
  }

  const query =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  await connection.promise().query(query, [
    answer.first_name,
    answer.last_name,
    answer.role_id,
    answer.manager_id === "0" ? null : answer.manager_id, // If manager_id is 0, insert NULL
  ]);
  await mainMenu();
}
async function updateEmployeeRole() {
  const answer = await inquirer.prompt([
    {
      name: "employee_id",
      type: "input",
      message: "What is the ID of the employee whose role you want to update?",
      validate: (value) => (!isNaN(value) ? true : "Please enter a number"),
    },
    {
      name: "role_id",
      type: "input",
      message: "What is the new role ID for the employee?",
      validate: (value) => (!isNaN(value) ? true : "Please enter a number"),
    },
  ]);

  const query = "UPDATE employee SET role_id = ? WHERE id = ?";
  await connection.promise().query(query, [answer.role_id, answer.employee_id]);
  await mainMenu();
}

mainMenu();
