const { notFoundError } = require("./errors");

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
