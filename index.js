const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/user.router");

const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://cointab-employee.netlify.app",
  "http://localost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
//https://cointab-employee.netlify.app/

app.get("/", async (req, res) => {
  return res.send("Hello from Server!");
});

app.use("/users", userRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server at ${process.env.PORT}`)
);
