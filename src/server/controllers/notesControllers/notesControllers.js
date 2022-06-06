const debug = require("debug")("amazingN:notesControllers");
const chalk = require("chalk");
const Note = require("../../../database/models/Note");
const User = require("../../../database/models/User");

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    debug(chalk.green("Someone asked for all the notes"));

    res.status(200).json({ notes });
  } catch (err) {
    err.message = "Error getting all the notes";
    err.code = 404;

    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  const { idNote } = req.params;

  try {
    await Note.findByIdAndDelete(idNote);

    res.status(200).json({ msg: "Note deleted" });
    debug(chalk.green("Someone deleted a note"));
  } catch (err) {
    debug(chalk.red("Someone tried to delete a note that we don't have"));
    err.message = "No note with that id found";
    err.code = 404;

    next(err);
  }
};

const getUserNotes = async (req, res, next) => {
  const { username } = req.params;

  try {
    const { notes } = await User.findOne({ username }).populate(
      "notes",
      null,
      Note
    );

    res.status(200).json({ notes });
    debug(chalk.green("Someone asked for the notes of a user"));
  } catch (err) {
    debug(
      chalk.red("Someone tried to get the notes of a user that we don't have")
    );

    err.message = "No user with that username found";
    err.code = 404;
    next(err);
  }
};

const createNote = async (req, res, next) => {
  const { userId: id } = req;
  const { title, content, category } = req.body;
  try {
    const user = await User.findById(id);

    const noteToCreate = {
      title,
      content,
      category,
      author: user.username,
    };

    const newNote = await Note.create(noteToCreate);

    const newUser = {
      ...user,
      notes: user.notes.push(newNote.id),
    };

    await User.findByIdAndUpdate(user.id, newUser);

    res.status(201).json(newNote);
  } catch (err) {
    debug(chalk.red("Error creating a note"));

    err.message = "Error creating the note";
    err.code = 409;
    next(err);
  }
};

const editNote = async (req, res, next) => {
  const { noteId } = req.params;
  const { title, content, category } = req.body;

  try {
    const noteToEdit = await Note.findById(noteId);

    const noteEdited = {
      title,
      content,
      category,
      author: noteToEdit.author,
    };

    await Note.findByIdAndUpdate(noteId, noteEdited);
    const newNote = await Note.findById(noteId);

    debug(chalk.green("Someone asked to edit a note"));
    res.status(200).json(newNote);
  } catch (err) {
    debug(chalk.red("Someone asked to edit a note that we don't have"));

    err.message = "Error editing note";
    err.code = 400;
    next(err);
  }
};

module.exports = { getNotes, deleteNote, getUserNotes, createNote, editNote };
