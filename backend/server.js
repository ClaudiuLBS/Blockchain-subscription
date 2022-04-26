require("dotenv").config();
const express = require("express");
const app = express();

//ne conectam la baza de date

const allowCors = (req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
};

//asta de jos e ceva chestie care accepta interactiunea cu api-ul
app.use(allowCors);
app.use(express.json());

const subscribersRouter = require("./routes/subscribers");
app.use("/api", subscribersRouter);

app.listen(3030, () => console.log(`Listening to http://localhost:3030/`));
