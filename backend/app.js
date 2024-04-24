const server = require(`./server`);

require(`dotenv`).config();
server.createServer().then(r => console.log(`Server Backend is started`));