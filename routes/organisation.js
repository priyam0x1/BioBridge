const express = require("express");
const router = express.Router();

// register form - submit ==================Comes from public site
// app.post(
//   "/org",
//   validateDonor,
//   wrapAsync(async (req, res, next) => {
//     const donor = req.body.donor;
//     donor.sample_id = uuidv4();
//     donor.donor_id = uuidv4();
//     donor.received_date = new Date();
//     donor.status = "Pending";
//     const newDonor = new Donor(donor);
//     await newDonor.save();
//     res.render("public/thankDonor.ejs", { newDonor, currentPage: "donor" });
//   }),
// );
