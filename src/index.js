require("dotenv").config();

const initializeServer = require("./server/initializeServer");

const port = process.env.PORT ?? 4000;

initializeServer(port);
