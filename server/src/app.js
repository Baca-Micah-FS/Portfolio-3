const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo").default;
const session = require("express-session");

const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use((req, res, next) => {
  if (req.session?.userId) {
  }
  next();
});

app.get("/check", (req, res) => {
  res.json({ ok: true, message: "Server is running. Nice" });
});

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("OK");
});

module.exports = app;
