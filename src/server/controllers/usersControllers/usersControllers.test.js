const User = require("../../../database/models/User");
const { userMock } = require("../../../mocks/usersMocks");
const { userRegister } = require("./usersControllers");

describe("Given a userRegister function", () => {
  describe("When it's invoqued with a request with an user that doesn't exist and a response", () => {
    test("Then it shoulld call the response's status method with 201 and the json method with the new user without the password", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req = {
        body: {
          name: userMock.name,
          username: userMock.username,
          password: userMock.password,
          image: userMock.image,
        },
      };

      const next = jest.fn();

      const userCreated = {
        name: userMock.name,
        username: userMock.username,
        image: userMock.image,
        notes: [],
      };

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(userCreated);

      await userRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(userCreated);
    });
  });

  describe("When it's invoqued with a request with an user that already exists and a response", () => {
    test("Then it should call the received next function with an error", async () => {
      const req = {
        body: {
          name: "",
          username: "",
          password: "",
          image: "",
        },
      };
      const next = jest.fn();

      const expectedError = new Error();
      expectedError.code = 409;
      expectedError.message = "User already exists";

      User.findOne = jest.fn().mockResolvedValue(true);
      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's invoqued with a request with an invalid user and a response", () => {
    test("Then it should call the received next function with an error", async () => {
      const req = {
        body: {
          mane: "",
        },
      };
      const next = jest.fn();

      const expectedError = new Error();
      expectedError.code = 400;
      expectedError.message = "Bad request";

      User.findOne = jest.fn().mockResolvedValue(false);
      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
