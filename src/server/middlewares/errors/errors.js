const chalk = require("chalk");
const { ValidationError } = require("express-validation");
const debug = require("debug")("amazingN:server:middlewares:errors");

const notFoundError = (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug(chalk.red(`Error: ${err.message}`));
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "Internal server error";

  if (err instanceof ValidationError) {
    res.status(400).json({ message: "Validation error" });
    debug(chalk.red(err.message));
  } else {
    res.status(errorCode).json({ message: errorMessage });
  }
};

module.exports = {
  notFoundError,
  generalError,
};
