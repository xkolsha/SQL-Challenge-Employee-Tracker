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
