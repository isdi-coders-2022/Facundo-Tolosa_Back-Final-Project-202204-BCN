const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },

  imageBackup: {
    type: String,
    default: "",
  },

  notes: {
    type: [{ type: SchemaTypes.ObjectId, ref: "Note" }],
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
