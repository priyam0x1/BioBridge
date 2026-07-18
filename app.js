const express = require("express");
const app = express();
const mongooose = require("mongoose");
const Donor = require("./models/donor.js");
const path = require("path");

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

// Organisation Route
app.get("/org", async (req, res) => {
  const allDonor = await Donor.find({});
  res.render("organisation/org.ejs", { allDonor });
});

app.get("/org/:_id", async (req, res) => {
  let id = req.params._id;
  const donor = await Donor.findById(id);
  res.render("organisation/show.ejs", { donor });
});

app.listen(8080, () => {
  console.log(`Server is listening at port 8080`);
});
