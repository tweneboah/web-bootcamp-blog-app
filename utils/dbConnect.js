const mongoose = require("mongoose");

//db connect function

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/web-bootcamp-blog-app");
    console.log("DB has connected succesfully");
  } catch (error) {
    console.log("Db connection failed", error.message);
  }
};

module.exports = dbConnect;
