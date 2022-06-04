const Note = require("../../../database/models/Note");
const User = require("../../../database/models/User");
const { listOfNotesMock } = require("../../../mocks/notesMocks");
const { getNotes, deleteNote, getUserNotes } = require("./notesControllers");

describe("Given a getNotes controller", () => {
  describe("When it's invoqued with a response", () => {
    test("Then it should call the response's status method with 200 and the json method with a list of notes", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Note.find = jest.fn().mockResolvedValue(listOfNotesMock);

      await getNotes(null, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ notes: listOfNotesMock });
    });
  });

  describe("When it's invoqued with next function and the find method fails", () => {
    test("Then it should call next with an 404 error and the message: 'Error getting all the notes'", async () => {
      const next = jest.fn();
      const err = { code: 404, message: "Error getting all the notes" };

      Note.find = jest.fn().mockRejectedValue({});

      await getNotes(null, null, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});

describe("Given a deleteNote controller", () => {
  describe("When it's invoqued with a response and a request with an id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Note deleted' message", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = { params: { idNote: 1974 } };

      Note.findByIdAndDelete = jest.fn().mockResolvedValue();

      await deleteNote(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Note deleted" });
    });
  });

  describe("When it's invoqued with a response and a request with a invalid id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Note deleted' message", async () => {
      const next = jest.fn();
      const req = { params: { idNote: 1975 } };
      const expectedError = {
        message: "No note with that id found",
        code: 404,
      };

      Note.findByIdAndDelete = jest.fn().mockRejectedValue({});
      await deleteNote(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getUserNotes controller", () => {
  describe("When it's invoqued with a response and a request with the username to get the notes from", () => {
    test("Then it should call the response's status method with 200 and the json method with an array of notes", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = { params: { username: "Carlos" } };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({ notes: listOfNotesMock }),
      }));

      await getUserNotes(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ notes: listOfNotesMock });
    });
  });

  describe("When it's invoqued with a next function and a request with a username that doesn't exist", () => {
    test("Then it should call the next function with am error", async () => {
      const req = { params: { username: "Carlosn't" } };
      const next = jest.fn();
      const expectedError = {
        message: "No user with that username found",
        code: 404,
      };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue({}),
      }));

      await getUserNotes(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
