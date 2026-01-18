const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes");

const app = express();

// middleware for client side
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    // allows cookies
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/check", (req, res) => {
  res.json({ ok: true, message: "Server is running. Nice" });
});

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("OK");
});

module.exports = app;
