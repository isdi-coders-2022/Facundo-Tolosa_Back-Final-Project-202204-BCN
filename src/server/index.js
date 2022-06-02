require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { notFoundError, generalError } = require("./middlewares/errors/errors");
const usersRouter = require("./routers/usersRouter/usersRouter/usersRouter");
const auth = require("./middlewares/auth/auth");
const notesRouter = require("./routers/notesRouter/notesRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/user", usersRouter);
app.use("/notes", auth, notesRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
