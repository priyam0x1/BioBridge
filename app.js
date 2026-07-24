const express = require("express");
const app = express();
const mongooose = require("mongoose");
const Donor = require("./models/donor.js");
const Request = require("./models/request.js");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/bioBridge";
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

// app.get("/testDonate", async (req, res) => {
//   let sampleDonate = new Donor({
//     name: "Aarav Sharma",
//     dob: new Date("1998-05-14"),
//     phone: "9876543210",
//     email: "aarav.sharma@example.com",
//     address: "Guwahati, Assam",
//     blood_grp: "A+",
//     gender: "Male",
//     med_con: "None",
//     recived_date: new Date("2026-07-01"),
//     test_date: new Date("2026-07-05"),
//     status: "Available",
//     HLA_Type: "A*02:01, B*15:01",
//     donor_id: "DNR001",
//     sample_id: "SMP001",
//   });
//
//   await sampleDonate.save();
//   console.log("Saved Successful");
//   res.send("Succes testing");
// });

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

// =================================Public Route - From Here======================================
// Public main page
app.get("/public", (req, res) => {
  res.render("public/public.ejs", { currentPage: "public" });
});

// =================================Public Route - To Here========================================

// =================================Donor Route - From Here==========================================
// register form - new donor
app.get("/public/register", (req, res) => {
  res.render("public/register.ejs", { currentPage: "donor" });
});

// register form - submit
app.post("/org", async (req, res) => {
  const donor = req.body.donor;
  donor.sample_id = uuidv4();
  donor.donor_id = uuidv4();
  donor.received_date = new Date();
  donor.status = "Pending";
  const newDonor = new Donor(donor);
  await newDonor.save();
  res.render("public/thankDonor.ejs", { newDonor, currentPage: "donor" });
});

// =================================Donor Route - To Here==========================================

// =================================Hospital Route - Frome Here========================================

// Hospital login
app.get("/public/hospitallogin", (req, res) => {
  res.render("public/hospitalLogin.ejs", { currentPage: "hospital" });
});

// Hospital Request
app.get("/public/request", (req, res) => {
  res.render("public/request.ejs", { currentPage: "hospital" });
});

// Hospital Request Store
app.post("/org/orgdashboard", (req, res) => {
  res.render("public/thankHospital.ejs", { currentPage: "public" });
});

// =================================Hospital Route - To Here========================================

// =================================Laboratory Route - From Here ==================================
// Lab Login
app.get("/lab/lablogin", async (req, res) => {
  res.render("laboratory/labLogin.ejs", { currentPage: "lab" });
});

// Lab Dashboard
app.get("/lab/labdashboard", async (req, res) => {
  const pendingDonors = await Donor.countDocuments({
    status: "Pending",
  });
  const submittedDonors = await Donor.countDocuments({
    status: "Submitted",
  });
  const allDonor = await Donor.find({});
  res.render("laboratory/labDashboard.ejs", {
    allDonor,
    currentPage: "lab",
    pendingDonors,
    submittedDonors,
  });
});

// search option laboratory
app.get("/lab/labdashboard/search", async (req, res) => {
  const { search } = req.query;
  const allDonor = await Donor.find({
    status: "Pending",

    $or: [{ name: search }, { blood_grp: search }, { sample_id: search }],
  });

  res.render("laboratory/searchResult.ejs", {
    allDonor,
    search,
    currentPage: "lab",
  });
});

// Lab test result enter form
app.get("/lab/:id/testresult", async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  res.render("laboratory/testResult.ejs", { donor, currentPage: "lab" });
});

// Result enter on database
app.put("/lab/:id", async (req, res) => {
  const { id } = req.params;
  await Donor.findByIdAndUpdate(id, {
    ...req.body.donor,
    status: "Submitted",
    test_date: Date.now(),
  });
  const donor = await Donor.findById(id);
  console.log(donor);
  res.redirect("/lab/labDashboard");
});

// delete route individual
app.delete("/lab/labdashboard/:id", async (req, res) => {
  const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
  console.log(deletedDonor);
  res.redirect("/lab/labdashboard");
});

// =================================Laboratory Route - To Here ==================================

// ============================ Organisation Route - From Here ==================================
// organisation dashboard
app.get("/org/orglogin", (req, res) => {
  res.render("organisation/orgLogin.ejs", { currentPage: "org" });
});

// organisation dashboard
app.get("/org/orgdashboard", async (req, res) => {
  const totalDonors = await Donor.countDocuments({});
  const totalRequest = await Request.countDocuments({});
  const allDonor = await Donor.find({});
  const allRequest = await Request.find({});
  res.render("organisation/orgDashboard.ejs", {
    allDonor,
    currentPage: "org",
    totalDonors,
    totalRequest,
    allRequest,
  });
});

// search option organisation
app.get("/org/orgdashboard/search", async (req, res) => {
  const { search } = req.query;
  const allDonor = await Donor.find({
    status: "Submitted",
    $or: [
      { name: search },
      { blood_grp: search },
      { phone: search },
      { email: search },
      { address: search },
      { HLA_type: search },
      { sample_id: search },
      { donor_id: search },
    ],
  });

  res.render("organisation/searchResult.ejs", {
    allDonor,
    search,
    currentPage: "org",
  });
});

// show route individual
app.get("/org/orgdashboard/:id", async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  res.render("organisation/viewDonor.ejs", { donor, currentPage: "org" });
});

app.get("/org/orgdashboard/request", (req, res) => {
  res.send("Baba Tumi");
});

// Hospital request view individual
app.get("/org/orgdashboard/request/:id", async (req, res) => {
  const request = await Request.findById(req.params.id);
  res.render("organisation/hospitalRequest.ejs", {
    request,
    currentPage: "org",
  });
});

// Decline Request Hospital
app.delete("/org/orgdashboard/request/:id", async (req, res) => {
  const declineReq = await Request.findByIdAndDelete(req.params.id);
  console.log(declineReq);
  res.redirect("/org/orgdashboard");
});

// delete route individual
// app.delete("/org/:id", async (req, res) => {
//   const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
//   console.log(deletedDonor);
//   res.redirect("/org/orgdashboard");
// });

// ===================================Organisation Route - To Here ==================================

app.listen(8080, () => {
  console.log(`Server is listening at port 8080`);
});
