const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);

// WebSocket
const { callmeWebSocket } = require('./app/controllers/exampleController.js');
callmeWebSocket(server);

const corsOptions = {
  origin: ["http://localhost:8081"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const db = require("./app/models");

const seedDatabase = async () => {
  try {
    await db.sequelize.sync();
    console.log('Database synchronized');
    await require('./app/seeders/seed')();
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Import and use routes
const exampleRoutes = require('./app/routes/exampleRoutes');
app.use('/api', exampleRoutes);

if (process.env.NODE_ENV  === 'test') {
  module.exports = app;
} else {
  const PORT = process.env.NODE_DOCKER_PORT || 8080;

  server.listen(PORT, async () => {
    await seedDatabase();
    console.log(`Server is running on port ${PORT}.`);
  });
}