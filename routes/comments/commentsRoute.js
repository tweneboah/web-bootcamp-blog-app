const express = require("express");
const commentsRoute = express.Router();
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
//get comment form
commentsRoute.get("/create", (req, res) => {
  res.render("comments/addcomment");
});

//create comment logic

commentsRoute.post("/create/:id", async (req, res) => {
  try {
    //1.: find the login user - session
    if (!req?.session?.authUser) {
      req.flash("error", "Please login first");
      return res.redirect("/comments/create");
    }

    //2. create a comment with the found user
    const comment = await Comment.create({
      description: req.body.description,
      user: req.session.authUser,
    });

    console.log(comment);
    //3. find the post we want to comment = req.params.id

    const post = await Post.findById(req.params.id);
    //4. push the created comment into the found post
    post.comments.push(comment._id);
    await post.save();
    console.log(post);
    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

module.exports = commentsRoute;
