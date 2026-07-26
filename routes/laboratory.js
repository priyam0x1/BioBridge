const express = require("express");
const router = express.Router();
const Donor = require("../models/donor.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// Lab Login
router.get(
  "/lablogin",
  wrapAsync(async (req, res) => {
    res.render("laboratory/labLogin.ejs", { currentPage: "lab" });
  }),
);

// Lab Dashboard
router.get(
  "/labdashboard",
  wrapAsync(async (req, res) => {
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
  }),
);

// search option laboratory
router.get(
  "/labdashboard/search",
  wrapAsync(async (req, res) => {
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
  }),
);

// Lab test result enter form
router.get(
  "/:id/testresult",
  wrapAsync(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    res.render("laboratory/testResult.ejs", { donor, currentPage: "lab" });
  }),
);

// Result enter on database
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Donor.findByIdAndUpdate(id, {
      ...req.body.donor,
      status: "Submitted",
      test_date: Date.now(),
    });
    const donor = await Donor.findById(id);
    res.redirect("/lab/labDashboard");
  }),
);

// delete route individual
router.delete(
  "/labdashboard/:id",
  wrapAsync(async (req, res) => {
    const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
    console.log(deletedDonor);
    res.redirect("/lab/labdashboard");
  }),
);

module.exports = router;
