const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../../database");
const User = require("../../../database/models/User");
const Note = require("../../../database/models/Note");
const { usersMock } = require("../../../mocks/usersMocks");
const app = require("../..");
const {
  listOfNotesMock,
  noteToBeEdited,
} = require("../../../mocks/notesMocks");

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
  await request(app)
    .post("/user/register")
    .type("multipart/formd-ata")
    .field("username", "carlos")
    .field("password", "carlos")
    .field("name", "carlos")
    .attach("image", Buffer.from("mockImageString", "utf-8"), {
      filename: "mockiamge",
      originalname: "image.jpg",
    })
    .expect(201);

  await request(app)
    .post("/user/register")
    .type("multipart/formd-ata")
    .field("username", "ernesto")
    .field("password", "ernesto")
    .field("name", "ernesto")
    .attach("image", Buffer.from("mockImageString", "utf-8"), {
      filename: "mockiamge",
      originalname: "image.jpg",
    })
    .expect(201);
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
    test("Then it should respond with a 201 status and the new note created", async () => {
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

  describe("When it receives a request with a valid token and note to create with no title or category", () => {
    test("Then it should respond with a 400 status and the message 'Validation error'", async () => {
      const expectedMessage = "Validation error";
      const content = "content";

      const noteToCreate = {
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

      const {
        body: { message },
      } = await request(app)
        .post(`/notes`)
        .set("Authorization", `Bearer ${token}`)
        .send(noteToCreate)
        .expect(400);

      expect(message).toBe(expectedMessage);
    });
  });
});

describe("Given a PUT /notes/ endpoint", () => {
  describe("When it receives a request with a valid token, an id to edit and a note", () => {
    test("Then it should respond with a 200 status and the note edited", async () => {
      const titleEdited = "Edited note";
      const categoryEdited = "Category 1";
      const contentEdited = "Content of the edited note";

      const changesToMake = {
        title: titleEdited,
        category: categoryEdited,
        content: contentEdited,
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
        .send(noteToBeEdited)
        .expect(201);

      const { body: noteEdited } = await request(app)
        .put(`/notes/${noteCreated.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(changesToMake)
        .expect(200);

      expect(noteEdited).toHaveProperty("title", titleEdited);
      expect(noteEdited).toHaveProperty("category", categoryEdited);
      expect(noteEdited).toHaveProperty("content", contentEdited);
      expect(noteEdited).toHaveProperty("creationDate");
      expect(noteEdited).toHaveProperty("author", usersMock[0].username);
    });
  });
});

describe("Given a GET /notes/note/:idNote endpoint", () => {
  describe("When it receives a request with a valid token, an id at the params", () => {
    test("Then it should respond with a 200 status and the note with that id", async () => {
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
        .send(noteToBeEdited)
        .expect(201);

      const { body: noteEdited } = await request(app)
        .get(`/notes/note/${noteCreated.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(noteEdited).toHaveProperty("title", noteToBeEdited.title);
    });
  });

  describe("When it receives a request with a valid token and id of a note that doesn't exists at the params", () => {
    test("Then it should respond with a 404 status and the message 'Note not found'", async () => {
      const expectedMessage = "Note not found";

      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: usersMock[0].username,
          password: usersMock[0].password,
        })
        .expect(200);

      const {
        body: { message },
      } = await request(app)
        .get(`/notes/note/1974`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(message).toBe(expectedMessage);
    });
  });
});
