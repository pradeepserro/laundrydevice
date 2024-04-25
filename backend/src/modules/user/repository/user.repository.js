const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
// const { dbConfig } = require('../../../helpers/database'); // Import the dbConfig
dbConfig = {
    host: 'localhost',
    user: 'pradeep',
    password: 'Abcd@1234',
    database: 'spincycle',
    namedPlaceholders: true,
  };

class UserRepository {
    
  constructor() {
    // You don't need to define the dbConfig here
  }

  

  async findByID(UserID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute("SELECT * FROM MachineUsers WHERE UserID = ?", [UserID]);
        
      return rows[0];
    } finally {
      connection.end();
    }
  }

  async findByEmail(Email) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM MachineUsers WHERE Email = ?', [Email]);
      console.log('rows repository');
      console.log(rows);
      return rows[0];
    } finally {
      connection.end();
    }
  }

  async getAllUsers() {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('SELECT * FROM MachineUsers');
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
      const UserID = uuidv4();
      const [rows] = await connection.execute(
        'INSERT INTO MachineUsers (UserID, Username, BirthDate, PhoneNumber, Email) VALUES (?, ?, ?, ?, ?)',
        [UserID, data.Username, data.BirthDate, data.PhoneNumber, data.Email]
      );

      if (rows.affectedRows > 0) {
        return { UserID, Username: data.Username, BirthDate: data.BirthDate, PhoneNumber: data.PhoneNumber, Email: data.Email };
      } else {
        throw new Error('User creation failed');
      }
    } finally {
      connection.end();
    }
  }

  async update(UserID, data) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        'UPDATE MachineUsers SET Username = ?, BirthDate = ?, PhoneNumber = ?, Email = ? WHERE UserID = ?',
        [data.Username, data.BirthDate, data.PhoneNumber, data.Email, UserID]
      );

      if (rows.affectedRows > 0) {
        return { UserID, Username: data.Username, BirthDate: data.BirthDate, PhoneNumber: data.PhoneNumber, Email: data.Email };
      } else {
        throw new Error('User update failed');
      }
    } finally {
      connection.end();
    }
  }

  async deleteByID(UserID) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute('DELETE FROM MachineUsers WHERE UserID = ?', [UserID]);

      if (rows.affectedRows > 0) {
        return 'User deleted successfully';
      } else {
        throw new Error('User deletion failed');
      }
    } finally {
      connection.end();
    }
  }
}

module.exports = new UserRepository();
