const Note = require("../../../database/models/Note");
const { listOfNotes } = require("../../../mocks/notesMocks");
const { getNotes } = require("./notesControllers");

describe("Given a getNotes function", () => {
  describe("When it's invoqued with a response", () => {
    test("Then it should call the response's status method with 200 and the json method with a list of notes", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Note.find = jest.fn().mockResolvedValue(listOfNotes);

      await getNotes(null, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ notes: listOfNotes });
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
