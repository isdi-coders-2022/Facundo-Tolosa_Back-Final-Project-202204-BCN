const express = require("express");
const { validate } = require("express-validation");
const {
  credentialsRegisterSchema,
} = require("../../../schemas/userCredentialsSchema");
const {
  userRegister,
  userLogin,
} = require("../../controllers/usersControllers/usersControllers");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(credentialsRegisterSchema),
  userRegister
);
usersRouter.post("/login", userLogin);

module.exports = usersRouter;
