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
    test("Then it should respond with a 200 status and a list of two notes", async () => {
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
        .set("Authorization", `Bearer 1973`)
        .expect(401);

      expect(message).toBe(expectedMessage);
    });
  });
});

describe("Given a DELETE /notes/:id endpoint", () => {
  describe("When it receives a request with a valid token and a id to delete", () => {
    test("Then it should respond with a 200 status", async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: usersMock[0].username,
          password: usersMock[0].password,
        })
        .expect(200);

      const { id: idToDelete } = await Note.create(listOfNotesMock[0]);
      await Note.create(listOfNotesMock[1]);

      await request(app)
        .delete(`/notes/${idToDelete}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("When it receives a request with a valid token and a invalid id to delete", () => {
    test("Then it should respond with a 404 status", async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: usersMock[0].username,
          password: usersMock[0].password,
        })
        .expect(200);

      await request(app)
        .delete(`/notes/1974`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe("Given a POST /notes/ endpoint", () => {
  describe("When it receives a request with a valid token and note to create", () => {
    test.only("Then it should respond with a 201 status and the new note created", async () => {
      const title = "Amazing note";
      const category = "notes";
      const content = "content";

      const noteToCreate = {
        title,
        category,
        content,
      };

      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: usersMock[0].username,
          password: usersMock[0].password,
        })
        .expect(200);

      const { body: noteCreated } = await request(app)
        .post(`/notes`)
        .set("Authorization", `Bearer ${token}`)
        .send(noteToCreate)
        .expect(201);

      expect(noteCreated).toHaveProperty("title", title);
      expect(noteCreated).toHaveProperty("category", category);
      expect(noteCreated).toHaveProperty("content", content);
      expect(noteCreated).toHaveProperty("creationDate");
      expect(noteCreated).toHaveProperty("author", usersMock[0].username);
    });
  });
});
