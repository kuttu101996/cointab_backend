const db = require("../dbConnection");

const allUser = async (req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM users`).catch((err) => {
      console.log(err);
      return res.send({
        message: "Error getting result from DB",
        error: err.message,
      });
    });
    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error.", error });
  }
};

const addUser = async (req, res) => {
  try {
    const userData = req.body;

    const [insertedData] = await db
      .query(`SELECT * FROM users WHERE id=${Number(userData.id)}`)
      .catch((err) => {
        return res
          .status(500)
          .send({ message: "Error getting result from DB", err });
      });

    if (insertedData.length > 0)
      return res
        .status(409)
        .json({ message: "User already exists", data: insertedData });

    const insertQuery = `
      INSERT INTO users (id, name, username, email, street, suite, city, zipcode, lat, lng, phone, website, company_name, catchPhrase, bs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [insertionData] = await db.query(insertQuery, [
      userData.id,
      userData.name,
      userData.username,
      userData.email,
      userData.address.street,
      userData.address.suite || null,
      userData.address.city,
      userData.address.zipcode,
      userData.address.geo.lat,
      userData.address.geo.lng,
      userData.phone,
      userData.website,
      userData.company.name,
      userData.company.catchPhrase,
      userData.company.bs,
    ]);

    return res.status(200).json({ message: "Success", data: insertionData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { allUser, addUser };
