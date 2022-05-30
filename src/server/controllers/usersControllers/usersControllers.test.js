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

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(req.body);

      await userRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
