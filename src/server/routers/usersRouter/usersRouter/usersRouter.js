const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
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
const uploadFirebase = require("../../../middlewares/uploadFirebase/uploadFirebase");

const usersRouter = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 8000000,
  },
});

usersRouter.post(
  "/register",
  upload.single("image"),
  validate(credentialsRegisterSchema),
  uploadFirebase,
  userRegister
);
usersRouter.post("/login", validate(credentialsLoginSchema), userLogin);
usersRouter.get("/:username", auth, getUser);

module.exports = usersRouter;
