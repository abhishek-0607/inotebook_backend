const { Schema, model } = require("mongoose");

const notesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
});
const Notes = model("notes", notesSchema);
module.exports = Notes;
