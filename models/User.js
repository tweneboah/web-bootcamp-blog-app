const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//firstname
//lastname
//email
//password
//profileimage
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//hash password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//verify user password
userSchema.methods.isPasswordValid = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//csutom method/passwordVerification
userSchema.methods.passwordVerification = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//compile the schema to form a model
const User = mongoose.model("User", userSchema);

module.exports = User;
