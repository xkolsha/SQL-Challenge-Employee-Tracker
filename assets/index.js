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
