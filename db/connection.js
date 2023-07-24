import dotenv from "dotenv";
import mysql from "mysql2";
import chalk from "chalk";

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employee_tracker",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(chalk.bgGreen("Connected!"));
});

export default connection;
