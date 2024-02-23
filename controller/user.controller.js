const UserModel = require("../Model/user.model");
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.development);

const allUser = async (req, res) => {
  try {
    const result = await UserModel.getAllUsers();

    res.status(400).json({ message: "Success", data: result });
  } catch (error) {
    if (error.message === "No Data Available") {
      res.status(400).json({ message: "No Data Available" });
    } else {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
};

const findUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.getUserById(userId);

    return res.status(200).json({ message: "Success", data: user });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

const addUser = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData)
      return res.status(400).json({ message: "Required details not provided" });

    const createdUser = await UserModel.createUser(userData);

    return res.status(201).json({ message: "Success", data: createdUser });
  } catch (error) {
    if (error.message.includes("validation error")) {
      return res.status(400).json({ message: error.message });
    } else if (error.message.includes("User already exists")) {
      return res.status(409).json({
        message: "User already exists",
      });
    } else if (error.message.includes("Unable to insert user")) {
      return res
        .status(500)
        .json({ message: "Error creating user in the database" });
    } else {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

const addPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = req.body;

    let existingUser = await UserModel.getUserById(userId);
    existingUser = JSON.parse(existingUser.posts);

    if (existingUser.length === 0) {
      const updatedUser = await knex("users")
        .where("id", userId)
        .update({
          posts: JSON.stringify(posts),
        })
        .returning("posts");

      return res.status(200).json({
        message: "Success",
        addition_message: "Posts added successfully",
        data: updatedUser[0],
      });
    } else {
      return res.status(200).json({
        message: "Success",
        addition_message: "Posts already present",
        data: existingUser.posts,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { allUser, findUserById, addUser, addPost };
