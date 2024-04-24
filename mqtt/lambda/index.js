const mysql = require('mysql2/promise');

// Configuration for MySQL database
const dbConfig = {
    host: '172.31.28.99',
    user: 'spincycle',
    password: 'Ls39GSHzr3',
    database: 'spincycle',
    connectTimeout: 15000,
    namedPlaceholders: true,
};

exports.handler = async (event) => {
    try {
        // Parse the incoming IoT message
        console.log('event');
        console.log(event);
        // console.log('event.records');
        // console.log(event.records);
        // const message = JSON.parse(event.records[0].Sns.Message);

        let str2 = JSON.stringify(event, null, 2);
         console.log("str2");
         console.log(str2);

        let data = JSON.parse(str2);
        console.log("data ");
        console.log(data);
        // console.log("data length");
        // console.log(data.length);
        

        //if data length is 2, return 0
        if (data.timestamp && data.MacAddress) {
            let timestamp = data['timestamp'];
            let MacAddress = data['MacAddress'];

            // Create a MySQL database connection
            console.log("START trying connection");
            const connection = await mysql.createConnection(dbConfig);
            console.log("END trying connection")


            // instert timestamp value to LastSeen field in machines table where macaddress is equal to MacAddress
            const insertQuery = `UPDATE Machines SET LastSeen = ? WHERE MacAddress = ?`;
            const values = [
                timestamp,
                MacAddress
            ];
            
            console.log("values are");
            console.log(values);

            console.log("inserting values to db for Test Status");
            // Execute the SQL query
            await connection.execute(insertQuery, values);
            console.log("values inserted to db");
            // Close the database connection
            await connection.end();


        } else {
            let Date = data['Date'];
            // console.log("Date");
            // console.log(Date);

            let time = data['time'];
            // console.log("time");
            // console.log(time);

            let MacAddress = data['MacAddress'];
            // console.log("MacAddress");
            // console.log(MacAddress);

            let Origin = data['Origin'];
            // console.log("Origin");
            // console.log(Origin);

            let CoinAcceptor = data['CoinAcceptor'];
            // console.log("CoinAcceptor1");
            // console.log(CoinAcceptor1);

            let HighVoltage = data['HighVoltage'];
            // console.log("HighVoltage");

            let LowVoltage = data['LowVoltage'];
            // console.log("LowVoltage");


            // Create a MySQL database connection
            console.log("START trying connection");
            const connection = await mysql.createConnection(dbConfig);
            console.log("END trying connection")

            // Construct the SQL query for inserting data
            const insertQuery = `INSERT INTO Transactions (Date, time, MacAddress, Origin, CoinAcceptor, HighVoltage, LowVoltage) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            // Define the values to insert
            const values = [
                Date,
                time,
                MacAddress,
                Origin,
                CoinAcceptor,
                HighVoltage,
                LowVoltage
            ];
            console.log("inserting values to db");
            // Execute the SQL query
            await connection.execute(insertQuery, values);
            console.log("values inserted to db");
            // Close the database connection
            await connection.end();
        }





        return 'Data inserted into the RDS database successfully';
    } catch (error) {
        console.error('Error msg:', error);
        console.error('Error Details:', JSON.stringify(error, null, 2));
        return error;
    }
}
