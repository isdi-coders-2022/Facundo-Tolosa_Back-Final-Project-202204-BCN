const fs = require("fs");
const path = require("path");
const uploadFirebase = require("./uploadFirebase");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("avatarRef"),
  uploadBytes: jest.fn().mockResolvedValue({}),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("url"),
}));

describe("Given a uploadFirebase middleware", () => {
  describe("When it receives a request with a file", () => {
    test("Then it should call the received next function", async () => {
      const req = { file: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback();
      });

      const next = jest.fn();
      await uploadFirebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request without a file", () => {
    test("Then it should call the received next function", async () => {
      const req = { file: null };

      const next = jest.fn();
      await uploadFirebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a file", () => {
    test("Then it should call the received next function", async () => {
      const req = { file: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      const next = jest.fn();
      await uploadFirebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a file", () => {
    test.only("Then it should call the received next function", async () => {
      const req = { file: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback("readFileError");
      });

      const next = jest.fn();
      await uploadFirebase(req, null, next);

      expect(next).toHaveBeenCalledWith("readFileError");
    });
  });
});
