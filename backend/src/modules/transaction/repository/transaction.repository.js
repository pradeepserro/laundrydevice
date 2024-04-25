const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

dbConfig = {
  host: 'localhost',
  user: 'pradeep',
  password: 'Abcd@1234',
  database: 'spincycle',
  namedPlaceholders: true,
};

class TransactionRepository {
  constructor() {
    // You don't need to define the dbConfig here
  }

  async findByID(TransactionID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM Transactions WHERE TransactionID = ?', [TransactionID]);

      return rows[0];
    } finally {
      connection.end();
    }
  }

  async addTransaction(time, Date, MacAddress, Origin, CoinAcceptor, HighVoltage, LowVoltage){
    const connection = await mysql.createConnection(dbConfig);
    console.log("repository time is: " + time);
    console.log("repository date is: " + Date);
    console.log("repository macaddress is: " + MacAddress);
    console.log("repository origin is: " + Origin);
    console.log("repository coinacceptor is: " + CoinAcceptor);
    console.log("repository HighVoltage is: " + HighVoltage);
    console.log("repository LowVoltage is: " + LowVoltage);
    try {
      const [rows] = await connection.execute('INSERT INTO Transactions (time, Date, MacAddress, Origin, CoinAcceptor, HighVoltage, LowVoltage) VALUES (?, ?, ?, ?, ?, ?, ?)', [time, Date, MacAddress, Origin, CoinAcceptor, HighVoltage, LowVoltage]);

      return rows[0];
    } finally {
      connection.end();
    }
  }

  async countTransactions() {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM Transactions');

      if (rows.length === 0) {
        return 0;
      }

      return rows[0].count;
    } finally {
      connection.end();
    }
  }

  async getAllTransactions() {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM Transactions');

      return rows;
    } finally {
      connection.end();
    }
  }

  async getAllTransactionsByMacAddress(MacAddress) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM Transactions WHERE MacAddress = ?', [MacAddress]);

      return rows;
    } finally {
      connection.end();
    }
  }
}

module.exports = new TransactionRepository();
