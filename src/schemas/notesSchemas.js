const { Joi } = require("express-validation");

const noteSchema = {
  body: Joi.object({
    title: Joi.string()
      .max(30)
      .messages({ message: "A title is required" })
      .required(),
    content: Joi.string()
      .messages({ message: "Content for the note is required" })
      .required(),
    category: Joi.string()
      .max(20)
      .messages({ message: "A category is required" })
      .required(),
  }),
};

module.exports = { noteSchema };
