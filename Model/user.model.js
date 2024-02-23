// models/UserModel.js
const Joi = require("joi");
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.development);

const tableName = "users";

const userSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.object({
    street: Joi.string().required(),
    suite: Joi.string(),
    city: Joi.string().required(),
    zipcode: Joi.string().required(),
    geo: Joi.object({
      lat: Joi.string().required(),
      lng: Joi.string().required(),
    }).required(),
  }).required(),
  phone: Joi.string().required(),
  website: Joi.string().required(),
  company: Joi.object({
    name: Joi.string().required(),
    catchPhrase: Joi.string().required(),
    bs: Joi.string().required(),
  }).required(),
  posts: Joi.array().items(Joi.object()),
});

const flattenUserData = (userData) => {
  return {
    name: userData.name,
    username: userData.username,
    email: userData.email,
    street: userData.address.street,
    suite: userData.address.suite || null,
    city: userData.address.city,
    zipcode: userData.address.zipcode,
    lat: userData.address.geo.lat,
    lng: userData.address.geo.lng,
    phone: userData.phone,
    website: userData.website,
    company_name: userData.company.name,
    catchPhrase: userData.company.catchPhrase,
    bs: userData.company.bs,
  };
};

const UserModel = {
  getAllUsers: async () => {
    try {
      const users = await knex(tableName).select();

      if (!users) {
        throw new Error("No Data Available");
      }

      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  getUserById: async (userId) => {
    try {
      const user = await knex(tableName).where("id", userId).first();

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      if (error.message.includes("User not found")) {
        throw new Error("User not found");
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  createUser: async (userData) => {
    try {
      const validation = userSchema.validate(userData);
      if (validation.error) {
        throw new Error(validation.error.details[0].message);
      }

      const existingUser = await knex(tableName)
        .where("username", userData.username)
        .orWhere("email", userData.email)
        .orWhere("id", userData.id)
        .first();

      if (existingUser) {
        throw new Error(`User already exists`);
      }

      const flattenedUser = flattenUserData(userData);

      const result = await knex(tableName).insert(flattenedUser).returning("*");

      if (!result || result.length === 0) {
        throw new Error("Unable to insert user");
      }

      return result;
    } catch (error) {
      if (error.message.includes("validation error")) {
        throw error;
      } else {
        throw new Error(`Error creating user(s): ${error.message}`);
      }
    }
  },

  addPostsToUser: async (userId, posts) => {
    try {
      // Fetch the user by userId
      const existingUser = await UserModel.getUserById(userId);

      // Check if the existing posts array is empty
      if (!existingUser.posts || existingUser.posts.length === 0) {
        // Update the posts array for the user
        const updatedUser = await knex(tableName)
          .where("id", userId)
          .update({
            posts: posts,
          })
          .returning("posts");

        return updatedUser[0]; // Return the updated 'posts' array
      } else {
        // Return the existing 'posts' array without making any changes
        return existingUser.posts;
      }
    } catch (error) {
      throw new Error(`Error adding posts to user: ${error.message}`);
    }
  },
};

module.exports = UserModel;
