const express = require("express");
const { userRegister } = require("../controllers/usersControllers");

const usersRouter = express.Router();

usersRouter.post("/register", userRegister);

module.exports = usersRouter;
