const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../../database/models/User");
const {
  userMock,
  userMockPopulated,
  userMockPopulatedWithoutPassword,
} = require("../../../mocks/usersMocks");
const { userRegister, userLogin, getUser } = require("./usersControllers");

describe("Given a userRegister function", () => {
  describe("When it's invoqued with a request with an user that doesn't exist and a response", () => {
    test("Then it should call the response's status method with 201 and the json method with the new user without the password", async () => {
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

describe("Given a userLogin function", () => {
  describe("When it's invoqued with a request with an user with the correct credentials", () => {
    test("Then it should call the response's status method with 200 and the json method with a token", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        body: {
          name: "carlos",
          username: "carlos",
        },
      };
      const expectedToken = 12345678;

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jsonwebtoken.sign = jest.fn().mockReturnValue(expectedToken);

      await userLogin(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When it's invoqued with a request with an user with a username that doesn't exists", () => {
    test("Then it should call the response's status method with 403 and the json method with the message 'Username or password incorrect'", async () => {
      const req = {
        body: {
          name: "carlos",
          username: "carlos",
        },
      };
      const next = jest.fn();
      const expectedError = new Error();
      expectedError.code = 403;
      expectedError.message = "Username or password incorrect";

      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's invoqued with a request with an user with a username and a wrong password", () => {
    test("Then it should call the response's status method with 403 and the json method with the message 'Username or password incorrect'", async () => {
      const req = {
        body: {
          name: "carlos",
          username: "carlos",
        },
      };
      const next = jest.fn();
      const expectedError = new Error();
      expectedError.code = 403;
      expectedError.message = "Username or password incorrect";

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getUser controller", () => {
  describe("When it's invoqued with a response and a request with the username to get", () => {
    test("Then it should call the response's status method with 200 and the json method with the user", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = { params: { username: "Carlos" } };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue(userMockPopulated),
      }));

      await getUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: userMockPopulatedWithoutPassword,
      });
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

      await getUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
