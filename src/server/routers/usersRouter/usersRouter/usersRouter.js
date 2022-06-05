const express = require("express");
const { validate } = require("express-validation");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../../../../schemas/userCredentialsSchema");
const {
  userLogin,
  userRegister,
  getUser,
} = require("../../../controllers/usersControllers/usersControllers");
const auth = require("../../../middlewares/auth/auth");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(credentialsRegisterSchema),
  userRegister
);
usersRouter.post("/login", validate(credentialsLoginSchema), userLogin);
usersRouter.get("/:username", auth, getUser);

module.exports = usersRouter;
