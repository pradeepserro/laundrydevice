const db = require('../../../helpers/database');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

dbConfig = {
  host: 'localhost',
  user: 'pradeep',
  password: 'Abcd@1234',
  database: 'spincycle',
  namedPlaceholders: true,
};

class MachineRepository {
  constructor() {
    // You don't need to define the dbConfig here
  }

  async findByID(MachineID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute("SELECT * FROM Machines WHERE MachineID = ?", [MachineID]);
      return rows[0];
    } finally {
      connection.end();
    }
  }

  async countMachines() {
    const connection = await mysql.createConnection(dbConfig);
  
    try {
      const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM Machines');
  
      if (rows.length === 0) {
        return 0;
      }
  
      return rows[0].count;
    } finally {
      connection.end();
    }
  }
  

  async getAllMachines() {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM Machines');
      console.log('rows repository');
      console.log(rows);
      return rows;
    } finally {
      connection.end();
    }
  }

  async create(data) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        'INSERT INTO Machines (MachineName, MacAddress, Country, State, StreetAddress, Model) VALUES (?, ?, ?, ?, ?, ?)',
        [data.MachineName, data.MacAddress, data.Country, data.State, data.StreetAddress, data.Model]
      );

      if (rows.affectedRows > 0) {
        return {
          MachineID: rows.insertId,
          MachineName: data.MachineName,
          MacAddress: data.MacAddress,
          Country: data.Country,
          State: data.State,
          StreetAddress: data.StreetAddress,
          Model: data.Model,
        };
      } else {
        throw new Error('Machine creation failed');
      }
    } finally {
      connection.end();
    }
  }

  async update(MachineID, data) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        'UPDATE Machines SET MachineName = ?, MacAddress = ?, Country = ?, State = ?, StreetAddress = ?, Model = ? WHERE MachineID = ?',
        [data.MachineName, data.MacAddress, data.Country, data.State, data.StreetAddress, data.Model, MachineID]
      );

      if (rows.affectedRows > 0) {
        return {
          MachineID,
          MachineName: data.MachineName,
          MacAddress: data.MacAddress,
          Country: data.Country,
          State: data.State,
          StreetAddress: data.StreetAddress,
          Model: data.Model,
        };
      } else {
        throw new Error('Machine update failed');
      }
    } finally {
      connection.end();
    }
  }

  async deleteByID(MachineID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('DELETE FROM Machines WHERE MachineID = ?', [MachineID]);

      if (rows.affectedRows > 0) {
        return 'Machine deleted successfully';
      } else {
        throw new Error('Machine deletion failed');
      }
    } finally {
      connection.end();
    }
  }
}

module.exports = new MachineRepository();
