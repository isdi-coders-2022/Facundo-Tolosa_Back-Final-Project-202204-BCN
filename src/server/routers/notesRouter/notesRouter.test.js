const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../../database");
const User = require("../../../database/models/User");
const Note = require("../../../database/models/Note");
const { usersMock } = require("../../../mocks/usersMocks");
const app = require("../..");
const { listOfNotesMock } = require("../../../mocks/notesMocks");

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

describe("Given a GET /notes/ endpoint", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should respond with a 200 status a list of two notes", async () => {
      const expectedLength = 2;

      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: usersMock[0].username,
          password: usersMock[0].password,
        })
        .expect(200);

      Note.create(listOfNotesMock[0]);
      Note.create(listOfNotesMock[1]);

      const {
        body: { notes },
      } = await request(app)
        .get("/notes")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(notes).toHaveLength(expectedLength);
    });
  });

  describe("When it receives a request with a invalid token", () => {
    test("Then it should respond with a 401 status and the message 'Invalid token'", async () => {
      const expectedMessage = "Invalid token";

      const {
        body: { message },
      } = await request(app)
        .get("/notes")
        .set("Authorization", `Bearer 1974`)
        .expect(401);

      expect(message).toBe(expectedMessage);
    });
  });
});
