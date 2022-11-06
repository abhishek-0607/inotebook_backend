const mongoose = require("mongoose");
const URL =
  "mongodb+srv://ab360:mongo2244@cluster0.ntjha.mongodb.net/inotebook";
const connect = () => {
  return mongoose.connect(URL);
};
module.exports = connect;
