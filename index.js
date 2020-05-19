// Main starting point of the application
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

// DB Connect
const connectionString =
  process.env.MONGODB_URI || "mongodb://localhost:auth/auth";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// App setup

app.use(morgan("combined"));
app.use(express.json({ type: "*/*" }));
router(app);

// Server setup

const PORT = process.env.port || 3090;
const server = http.createServer(app);
server.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
