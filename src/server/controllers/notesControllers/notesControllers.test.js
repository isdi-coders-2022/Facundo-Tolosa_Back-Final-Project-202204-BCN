const Note = require("../../../database/models/Note");
const User = require("../../../database/models/User");
const { listOfNotesMock } = require("../../../mocks/notesMocks");
const {
  getNotes,
  deleteNote,
  getUserNotes,
  createNote,
  editNote,
  getNote,
} = require("./notesControllers");

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

describe("Given a createNote controller", () => {
  const title = "title";
  const category = "category";
  const content = "content";
  const username = "roberto";

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    userId: "1974",
    body: {
      title,
      content,
      category,
    },
  };
  describe("When it's invoqued with a user Id, a title, content and category", () => {
    test("Then it should call the response's status method with 201 and the new object created", async () => {
      const expectedObjectCreated = {
        title,
        category,
        content,
        author: username,
      };

      User.findOne = jest.fn().mockResolvedValue({ username, notes: [] });
      Note.create = jest.fn().mockResolvedValue(expectedObjectCreated);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      await createNote(req, res, null);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedObjectCreated);
    });
  });

  describe("When it's invoqued with a user Id, a title, content, a category, a next function and the create method fails", () => {
    test("Then it should call the response's status method with 409 and a error message", async () => {
      const next = jest.fn();
      const expectedError = {
        message: "Error creating the note",
        code: 409,
      };

      User.findById = jest.fn().mockResolvedValue({ username });
      Note.create = jest.fn().mockRejectedValue({});

      await createNote(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a editNote controller", () => {
  const title = "title";
  const category = "category";
  const content = "content";
  const username = "carlos90";
  const noteId = "1974";

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    params: { noteId },
    body: {
      title,
      content,
      category,
    },
  };
  describe("When it's invoqued with a title, content, category and a id of the note to edit", () => {
    test("Then it should call the response's status method with 200 and the new object edited", async () => {
      const noteToEdit = {
        author: username,
      };

      const newNote = {
        title,
        category,
        content,
        author: username,
      };

      Note.findById = jest.fn().mockResolvedValue(noteToEdit);
      Note.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Note.findById = jest.fn().mockResolvedValue(newNote);

      await editNote(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newNote);
    });
  });

  describe("When it's invoqued with a id of a note that doesn't exists", () => {
    test("Then it should call the response's status method with 400 and the message 'Error editing note'", async () => {
      const expectedError = {
        message: "Error editing note",
        code: 400,
      };
      const next = jest.fn();

      Note.findById = jest.fn().mockRejectedValue({});

      await editNote(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getNote controller", () => {
  const req = {
    params: { idNote: "1974" },
  };
  describe("When it's invoqued with a response and a id of a note to find", () => {
    test("Then it should call the response's status method with 200 and the json method with a note", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Note.findById = jest.fn().mockResolvedValue(listOfNotesMock[0]);

      await getNote(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(listOfNotesMock[0]);
    });
  });

  describe("When it's invoqued with next function and an id of a note that doesn't exists", () => {
    test("Then it should call next with an 404 error and the message: 'Error getting all the notes'", async () => {
      const next = jest.fn();
      const err = { code: 404, message: "Note not found" };

      Note.findById = jest.fn().mockRejectedValue({});

      await getNote(req, null, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
