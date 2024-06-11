const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

const Tought = require("./models/Tougths");
const User = require("./models/User");

const toughtRouter = require("./routes/toughtsRoutes");
const authRouter = require("./routes/authRoutes");
const ToughtController = require("./controllers/toughtscontoller");
//confg handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//receber resposta do body
app.use(express.urlencoded({
  extended: true
}));
//session middleare
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {
        path: require("path").join(require("os").tmpdir(), "sessions");
      },
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);
//flash messages
app.use(flash());
//public path
app.use(express.static("public"));
//set session  to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next()
});
app.use("/toughts", toughtRouter);
app.use("/", authRouter);
app.use("/", ToughtController.showTougths);
conn
  .sync()
  .then(() => {
    console.log("servidor rodando")
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
