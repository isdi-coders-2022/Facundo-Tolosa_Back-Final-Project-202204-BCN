const userMockCredentials = {
  username: "roberto",
  password: "roberto",
};

const userMock = {
  username: "roberto",
  password: "roberto",
  name: "roberto",
  image: "image",
};

const usersMock = [
  {
    username: "carlos",
    password: "carlos",
    name: "carlos",
    image: "image",
  },
  {
    username: "ernesto",
    password: "ernesto",
    name: "ernesto",
    image: "image",
  },
];

const userMockPopulated = {
  username: "carlos",
  password: "$2b$10$dCqo02lYj1Qe6OcsxWnTeO1cqS4CfqODNWcwR8a0XKqTcUWvYS8g2",
  name: "carlos",
  image: "carlitos.jpg",
  notes: [
    {
      title: "Amazing note",
      content: "you can't believe this, it is amazing",
      category: "random",
      author: "carlos",
      creationDate: "2022-06-04T18:01:19.375Z",
      id: "629b9def60d62a65f3bc17ea",
    },
    {
      title: "Best note ever",
      content: "the content of this note is private (?)",
      category: "random",
      author: "carlos",
      creationDate: "2022-06-05T08:49:45.768Z",
      id: "629c6e290da6fac3a0c0cda9",
    },
  ],
  id: "629889a09f71ae38a5ab9ec6",
};

const userMockPopulatedWithoutPassword = {
  username: "carlos",
  name: "carlos",
  image: "carlitos.jpg",
  notes: [
    {
      title: "Amazing note",
      content: "you can't believe this, it is amazing",
      category: "random",
      author: "carlos",
      creationDate: "2022-06-04T18:01:19.375Z",
      id: "629b9def60d62a65f3bc17ea",
    },
    {
      title: "Best note ever",
      content: "the content of this note is private (?)",
      category: "random",
      author: "carlos",
      creationDate: "2022-06-05T08:49:45.768Z",
      id: "629c6e290da6fac3a0c0cda9",
    },
  ],
  id: "629889a09f71ae38a5ab9ec6",
};

module.exports = {
  userMock,
  usersMock,
  userMockCredentials,
  userMockPopulated,
  userMockPopulatedWithoutPassword,
};
