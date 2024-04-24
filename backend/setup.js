const mysql = require('mysql2/promise');
const CryptoJS = require("crypto-js");

const dbConfig = {
  host: 'localhost',
  user: 'spincycle',
  password: 'Ls39GSHzr3',
  database: 'spincycle',
  namedPlaceholders: true,
};

async function createTables() {
  const connection = await mysql.createConnection(dbConfig);

  // SQL statements to create tables
  const createMachinesTable = `
    CREATE TABLE IF NOT EXISTS Machines (
      MachineID INT AUTO_INCREMENT PRIMARY KEY,
      MachineName VARCHAR(255),
      MacAddress VARCHAR(255),
      Country VARCHAR(255),
      State VARCHAR(255),
      StreetAddress VARCHAR(255),
      Model VARCHAR(255)
    )
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS MachineUsers (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(255),
        BirthDate VARCHAR(255),
        PhoneNumber VARCHAR(255),
        Email VARCHAR(255),
        PasswordHash VARCHAR(255)
        )
    `;

    const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS Transactions (
      TransactionID INT AUTO_INCREMENT PRIMARY KEY,
      Date VARCHAR(255),
      time VARCHAR(255),
      MacAddress VARCHAR(255),
      Origin VARCHAR(255),
      Amount DECIMAL(10, 2)
    )
  `;


  try {
    await connection.execute(createMachinesTable);
    await connection.execute(createUsersTable);
    await connection.execute(createTransactionsTable);

    // await insertDemoMachinesData(connection);
    // await insertDemoUsersData(connection);
    // await insertDemoTransactionsData(connection);

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    connection.end();
  }
  // console.log('Done!');
  // let aa="Adam1234!!"
  // console.log('aa',aa);
  // let xx=CryptoJS.AES.encrypt(aa, 'inovtech').toString();
  // console.log('xx',xx);
  // let yy=CryptoJS.AES.decrypt(xx, 'inovtech').toString(CryptoJS.enc.Utf8);
  // console.log('yy',yy);
  // let zz=(yy==aa);
  // console.log('zz',zz);
}

async function insertDemoMachinesData(connection) {
    connection.connect(function(err) {
        console.log('inserting machines');
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO machines (MachineName, MacAddress, Country, State, StreetAddress, Model) values ?";
        var values = [
          [ 'Machine 1','BB:8A:0A:75:CE:CC', 'Canada', 'Ontario', '1st Street', 'Type A' ],
            [ 'Machine 2','BB:8A:0A:75:CE:BB', 'South Africa', 'Gauteng', '1st Street', 'Type B' ],
        ];
        connection.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Machines: Number of records inserted: " + result.affectedRows);
        });
      });
}

async function insertDemoUsersData(connection) {

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO MachineUsers (Username:Adam, BirthDate, PhoneNumber, Email,  PasswordHash ) VALUES ?";
        var values = [
            ['Adam', '01/06/1994', '58941470', 'adamo.loca@gmail.com', CryptoJS.AES.encrypt('Adam1234!!', 'inovtech').toString() ],
        ];
        connection.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Users: Number of records inserted: " + result.affectedRows);
        });
      });
}

async function insertDemoTransactionsData(connection) {
  const values = [
    ['12:55:20', 'B4:8A:0A:75:CE:94', 'Web', 4.25],
    ['12:45:20', 'B4:8A:0A:75:CE:94', 'Machine', 4.25],
    // Add more transaction data
  ];

  const sql = 'INSERT INTO Transactions (time, MacAddress, Origin, Amount) VALUES ?';

  try {
    await connection.execute(sql, [values]);
  } catch (error) {
    console.error('Error inserting transaction data:', error);
  }
}

createTables();
