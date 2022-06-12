const debug = require("debug")("amazingN:server:controllers:userControllers");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const { default: axios } = require("axios");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../../database/models/User");
const encryptPassword = require("../../../utils/encryptPassword");
const Note = require("../../../database/models/Note");

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const { img, imgBackup } = req;

  const user = await User.findOne({ username });
  if (user) {
    const err = new Error();
    err.code = 409;
    err.message = "User already exists";
    next(err);

    return;
  }

  try {
    const encryptedPassword = await encryptPassword(password);

    const newUser = await User.create({
      username,
      password: encryptedPassword,
      name,
      image: img,
      imageBackup: imgBackup,
    });

    debug(chalk.greenBright("User created"));

    const newUserWithoutPassword = {
      username: newUser.username,
      name: newUser.name,
      image: newUser.image,
      imageBackup: newUser.imageBackup,
      notes: newUser.notes,
      id: newUser.id,
    };

    res.status(201).json(newUserWithoutPassword);
  } catch (err) {
    err.code = 400;
    err.message = "Bad request";
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    debug(chalk.redBright("Username or password incorrect"));
    const err = new Error();
    err.code = 403;
    err.message = "Username or password incorrect";

    next(err);
    return;
  }

  const userData = {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
  };

  const rightPassword = await bcrypt.compare(password, user.password);

  if (!rightPassword) {
    debug(chalk.redBright("Username or password incorrect"));
    const err = new Error();
    err.code = 403;
    err.message = "Username or password incorrect";

    next(err);
    return;
  }

  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);
  res.status(200).json({ token });
};

const getUser = async (req, res, next) => {
  const { username } = req.params;
  const id = req.userId;

  try {
    const user = await User.findOne({ username }).populate("notes", null, Note);
    const activeUser = await User.findById(id);

    const userWithoutPassword = {
      username: user.username,
      name: user.name,
      image: user.image,
      imageBackup: user.imageBackup,
      notes: user.notes,
      id: user.id,
    };

    if (user.fcmToken) {
      await axios.post(
        "https://fcm.googleapis.com//v1/projects/amazing-notes-fe460/messages:send",
        {
          message: {
            token: `${user.fcmToken}`,
            notification: {
              title: "¡Your notes are amazing!",
              body: `${activeUser.username} is watching your profile`,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ya29.a0ARrdaM8vb425StXV9tXgMZGrpOS42IW6R71mwrckgSbtQZcBu3Ixz2SHlBx_LrcDlx2mo_XWrLO9XggRuHx_Af3h3ZisToZ25l6dDl_Xz9xAC0RE_K3b--4uLJBEVIPY6IEZ2aPiZ1sce75sVGJi0NDQXAi4`,
          },
        }
      );
    }

    res.status(200).json({ user: userWithoutPassword });
    debug(chalk.green("Someone asked for a user"));
  } catch (err) {
    debug(chalk.red("Someone tried to get a user that we don't have"));

    err.message = "No user with that username found";
    err.code = 404;
    next(err);
  }
};

const setFcmToken = async (req, res, next) => {
  const { userId } = req;
  const { fcmToken } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { fcmToken });

    res.status(200).json({});
  } catch (err) {
    debug(chalk.red("Error editing fcm token"));

    err.message = "Error editing fcm token";
    err.code = 400;
    next(err);
  }
};

module.exports = { userRegister, userLogin, getUser, setFcmToken };
