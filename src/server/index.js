require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRouter = require("./routers/usersRouter/usersRouter");
const { notFoundError, generalError } = require("./middlewares/errors/errors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/user", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
