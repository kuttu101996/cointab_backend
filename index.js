const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/user.router");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  return res.send("Hello from Server!");
});

app.use("/users", userRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server at ${process.env.PORT}`)
);
