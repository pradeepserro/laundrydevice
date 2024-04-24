const express = require('express')
const cors = require('cors');
// const socketIO = require('socket.io'); 
const http = require('http'); // Importez le module 'http'
const app = express()
const port = 4000
const router = express.Router();
const jwt = require('jsonwebtoken');


app.use(cors());
const bodyParser = require('body-parser')

const users = [
    { id: 1, email: 'user@example.com', password: 'password123' }
];

const createServer = async () => {
    app.use(bodyParser.json())

    // routes
    await require(`./src/routes/api`)(app);

    app.listen(port, () => {
        console.log(`App listening at http://127.0.0.1:${port}`)
    })

};

// Authentication route
router.post('/login', (req, res) => {
    const { emailId, password } = req.body;

    // Replace this with your actual user authentication logic
    const user = users.find((user) => user.email === emailId && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token (replace with your JWT logic)
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // Send the token as a response
    res.status(200).json({ token });
});

module.exports = {
    createServer,
    router
};
