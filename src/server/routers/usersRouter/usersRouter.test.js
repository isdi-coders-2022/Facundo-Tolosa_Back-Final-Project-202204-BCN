const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const app = require("../..");
const {
  usersMock,
  userMock,
  userMockCredentials,
} = require("../../../mocks/usersMocks");
const connectDB = require("../../../database");
const User = require("../../../database/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await request(app).post("/user/register").send(usersMock[0]).expect(201);
  await request(app).post("/user/register").send(usersMock[1]).expect(201);
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a POST /user/register endpoint", () => {
  describe("When it receives a request with a non registered user", () => {
    test("Then it should respond with a 201 status and the new user created", async () => {
      const { body } = await request(app)
        .post("/user/register")
        .send(userMock)
        .expect(201);

      expect(body).toHaveProperty("name", userMock.name);
    });
  });

  describe("When it receives a request with a registered user", () => {
    test("Then it should respond with a 409 status and the message 'User already exists'", async () => {
      const expectedMessage = { message: "User already exists" };

      const { body } = await request(app)
        .post("/user/register")
        .send(usersMock[0])
        .expect(409);

      expect(body).toEqual(expectedMessage);
    });
  });

  describe("When it receives a request with a invalid user", () => {
    test("Then it should respond with a 400 status and the message 'Bad request'", async () => {
      const expectedMessage = { message: "Bad request" };
      const invalidUser = { mane: "Carlos" };

      const { body } = await request(app)
        .post("/user/register")
        .send(invalidUser)
        .expect(400);

      expect(body).toEqual(expectedMessage);
    });
  });
});

describe("Given a POST /user/login endpoint", () => {
  describe("When it receives a request with a registered user", () => {
    test("Then it should respond with a 200 status and a token", async () => {
      await request(app).post("/user/register").send(userMock).expect(201);

      const { token } = await request(app)
        .post("/user/login")
        .send(userMockCredentials)
        .expect(200);

      expect(token).not.toBeNull();
    });
  });

  describe("When it receives a request with a unregistered user", () => {
    test("Then it should respond with a 403 status and the message 'Username or password incorrect'", async () => {
      const expectedMessage = { message: "Username or password incorrect" };
      const unregisteredUser = { username: "pepito40", password: "" };

      const { body } = await request(app)
        .post("/user/login")
        .send(unregisteredUser)
        .expect(403);

      expect(body).toEqual(expectedMessage);
    });
  });

  describe("When it receives a request with a registered user and a wrong password", () => {
    test("Then it should respond with a 403 status and the message 'Username or password incorrect'", async () => {
      const expectedMessage = { message: "Username or password incorrect" };
      const wrongPasswordUser = {
        username: usersMock[0].username,
        password: "asd",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(wrongPasswordUser)
        .expect(403);

      expect(body).toEqual(expectedMessage);
    });
  });
});
