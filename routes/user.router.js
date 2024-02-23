const {
  allUser,
  findUserById,
  addUser,
  addPost,
} = require("../controller/user.controller");

const userRouter = require("express").Router();

userRouter.get("/", allUser);
userRouter.get("/:id", findUserById);
userRouter.post("/", addUser);
userRouter.post("/:userId/posts", addPost);

module.exports = userRouter;
