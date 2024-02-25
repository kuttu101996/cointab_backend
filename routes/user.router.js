const { allUser, addUser } = require("../controller/user.controller");

const userRouter = require("express").Router();

userRouter.get("/", allUser);
userRouter.post("/insert-user", addUser);

module.exports = userRouter;
