const express = require("express");
const { validate } = require("express-validation");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../../../../schemas/userCredentialsSchema");
const {
  userLogin,
  userRegister,
} = require("../../../controllers/usersControllers/usersControllers");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(credentialsRegisterSchema),
  userRegister
);
usersRouter.post("/login", validate(credentialsLoginSchema), userLogin);

module.exports = usersRouter;
