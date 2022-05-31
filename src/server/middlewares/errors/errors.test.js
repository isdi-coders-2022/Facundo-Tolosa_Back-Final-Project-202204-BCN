const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundErrorFunction", () => {
  describe("When it's invoqued with a response", () => {
    test("Then it should call the response's status method with a 404 and the json method with a message", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedErrorCode = 404;
      const expectedMessage = { message: "Endpoint not found" };

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedErrorCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});

describe("Given a generalError function", () => {
  describe("When it's invoqued with a response and a error with a 401 error and a message", () => {
    test("Then it should call the response's method status with a 401 and the json method with the same message", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = {};
      const err = { code: 401, message: "Forbidden" };

      generalError(err, null, res, next);

      expect(res.status).toHaveBeenCalledWith(err.code);
      expect(res.json).toHaveBeenCalledWith({ message: err.message });
    });
  });

  describe("When it's invoqued with a response and a empty error", () => {
    test("Then it should call the response's method status with a 500 and the json method with the message 'General Pete'", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = {};
      const err = {};
      const expectedCode = 500;
      const expectedMessage = { message: "Internal server error" };

      generalError(err, null, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
