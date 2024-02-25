const { addPost, allPosts } = require("../controller/post.controller");

const postRouter = require("express").Router();

postRouter.get("/", allPosts);
postRouter.post("/", addPost);

module.exports = postRouter;
