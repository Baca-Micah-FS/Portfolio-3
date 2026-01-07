// intialize express app. Make a server that can handle routes
const express = require("express");

const routeHandler = require("./routes");

// inititalize cors package for connecting client to server
const cors = require("cors");

// for passwords and users
const cookieParser = require("cookie-parser");

// create express app
const app = express();

// create middleware.. Runs on every request before the routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// allow server to read JSON request bodies like { "name" : "Micah"}
app.use(express.json());

// allows server to read coookies for auth
app.use(cookieParser());

// server check
app.get("/check", (req, res) => {
  res.json({ ok: true, message: "Server is running. Nice" });
});

// mount routes
app.use("/api/v1", routeHandler);

app.get("/", (req, res) => {
  res.send("OK");
});

module.exports = app;
