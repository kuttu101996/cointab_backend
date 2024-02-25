const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./dbConnection");
const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");

const app = express();

app.use(express.json());
const allowedOrigins = [
  "https://cointab-employee.netlify.app/",
  "http://localhost:9000",
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

//
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./api.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Hello from Server!" });
});

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.all("*", async (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  err.statusCode = 404;

  next(err);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({ message: error.message });
});

db.query("SELECT 1")
  .then((result) => {
    console.log(result);
    app.listen(process.env.PORT, () =>
      console.log(`Server at ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("Error Connecting DB \n" + err);
  });
