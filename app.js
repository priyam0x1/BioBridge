if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ quiet: true });
}

const express = require("express");
const mongooose = require("mongoose");
const Donor = require("./models/donor.js");
const Request = require("./models/request.js");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { donorSchema, requestSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

const public = require("./routes/public.js");
const organisation = require("./routes/organisation.js");
const laboratory = require("./routes/laboratory.js");

const MONGO_URL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongooose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in MongoSession Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/public", public);
app.use("/lab", laboratory);
app.use("/org", organisation);

// Root Route==========================================================
app.get("/", (req, res) => {
  res.redirect("/public");
});

// Storing fake user
// app.get("/demouser", async (req, res) => {
//   try {
//     await User.register(
//       new User({
//         username: "LAB-001",
//         role: "lab",
//       }),
//       "hello",
//     );

//     await User.register(
//       new User({
//         username: "HOSP-001",
//         role: "hospital",
//       }),
//       "hello",
//     );

//     await User.register(
//       new User({
//         username: "ORG-001",
//         role: "organisation",
//       }),
//       "hello",
//     );

//     res.send("3 demo users created successfully!");
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// });

// Error handling for invalid route
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.render("error.ejs", { currentPage: "public", message });
});

// Server Start at port 8080
app.listen(8080, () => {
  console.log(`Server is listening at port 8080`);
});
