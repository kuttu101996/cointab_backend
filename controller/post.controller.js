const db = require("../dbConnection");

const allPosts = async (req, res) => {
  try {
    const allPosts = await db.query("SELECT * FROM posts").catch((err) => {
      return res
        .status(500)
        .json({ message: "Error in DB query", error: err.message });
    });
    // const distinctUserIds = await db.query("SELECT DISTINCT userid FROM posts");

    return res.status(200).json({
      message: "Distinct User IDs retrieved successfully",
      data: allPosts,
      // data: distinctUserIds,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const addPost = async (req, res) => {
  try {
    const postsData = Array.isArray(req.body) ? req.body : [req.body];
    const userid = postsData.length > 0 ? postsData[0].userId : null;

    if (!postsData)
      return res.status(400).json({ message: "Required details not provided" });

    const [userExists] = await db
      .query("SELECT * FROM users WHERE id = ?", [userid])
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error getting result from DB",
          error: err.message,
        });
      });

    if (userExists.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found with the given userid" });
    }

    const [existingPosts] = await db
      .query("SELECT * FROM posts WHERE userid = ?", [userid])
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error getting result from DB",
          error: err.message,
        });
      });

    const existingPostIds = new Set(existingPosts.map((post) => post.id));

    const insertPromises = postsData
      .filter((post) => {
        if (!existingPostIds.has(post.id)) {
          return post;
        }
      })
      .map((post) => {
        const { userId, id, title, body } = post;
        return db.query(
          `
        INSERT INTO posts (userid, id, title, body)
        VALUES (?, ?, ?, ?)
      `,
          [userId, id, title, body]
        );
      });

    const result = await Promise.all(insertPromises);

    return res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { allPosts, addPost };
