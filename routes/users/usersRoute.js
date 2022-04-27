const express = require("express");
const multer = require("multer");
const User = require("../../models/User");
const storage = require("../../utils/cloudinary");

const usersRoute = express.Router();

//pass multer as a middleware
const upload = multer({
  storage,
});

//get register form
usersRoute.get("/register", (req, res) => {
  res.render("users/register", {
    error: req.flash("error"),
  });
});

//.register user
usersRoute.post(
  "/register",
  upload.single("profileImage"),
  async (req, res) => {
    const { email, firstname, lastname, password } = req.body;

    try {
      //  chech if user is uploading profile photo

      if (!req.file?.path) {
        req.flash("error", "Please upload profile Image");

        return res.redirect("/users/register");
      }

      //1. check if user exist (email)
      const userFound = await User.findOne({ email });
      if (userFound) {
        req.flash("error", "User already exist");
        return res.redirect("/users/register");
      }

      await User.create({
        email,
        password,
        firstname,
        lastname,
        profileImage: req.file.path,
      });
      res.redirect("/users/login");
    } catch (error) {
      //send err using flash
      req.flash("error", error.message);
      res.redirect("/users/register");
    }
  }
);

//get the login form
usersRoute.get("/login", (req, res) => {
  //get the flash msg

  res.render("users/login", {
    error: req.flash("error"),
  });
});

//login user
usersRoute.post("/login", async (req, res) => {
  try {
    //check if user exist
    const userFound = await User.findOne({ email: req.body.email });
    //check if password is valid
    const isPasswordValid = await userFound?.passwordVerification(
      req.body.password.toString()
    );
    console.log(req.body.password);
    if (userFound && isPasswordValid) {
      //put user into session
      req.session.authUser = userFound;
      res.redirect("/users/profile/" + userFound._id);
    } else {
      //send error msg using flash
      req.flash("error", "Email or password is valid");
      res.redirect("/users/login");
    }
  } catch (error) {
    res.json(error);
  }
});
//fetch all users
usersRoute.get("/", async (req, res) => {
  //add data to the session
  console.log(req.session);
  res.send("This is users endpoint");
});

//logout
usersRoute.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
});

//profile page
usersRoute.get("/profile/:id", async (req, res) => {
  try {
    //find the user
    const user = await User.findById(req.params.id).populate("posts");
    console.log(user);
    res.render("users/profile", { user });
  } catch (error) {
    res.send(error);
  }
});

//fetch single
usersRoute.get("/:id", async (req, res) => {
  console.log(req.session);
  res.send("This is profile/details endpoint");
});

//update user
usersRoute.post("/update/:id", async (req, res) => {
  res.send("This is register endpoint");
});

module.exports = usersRoute;
