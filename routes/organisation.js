const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const Donor = require("../models/donor.js");
const Request = require("../models/request.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { donorSchema, requestSchema } = require("../schema.js");

// organisation dashboard
router.get("/orglogin", (req, res) => {
  res.render("organisation/orgLogin.ejs", { currentPage: "org" });
});

// organisation dashboard
router.get(
  "/orgdashboard",
  wrapAsync(async (req, res) => {
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
  }),
);

// search option organisation
router.get(
  "/orgdashboard/search",
  wrapAsync(async (req, res) => {
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
  }),
);

// show route individual
router.get(
  "/orgdashboard/:id",
  wrapAsync(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    res.render("organisation/viewDonor.ejs", { donor, currentPage: "org" });
  }),
);

// Hospital request view individual
router.get(
  "/orgdashboard/request/:id",
  wrapAsync(async (req, res) => {
    const request = await Request.findById(req.params.id);
    res.render("organisation/hospitalRequest.ejs", {
      request,
      currentPage: "org",
    });
  }),
);

// Decline Request Hospital
router.delete(
  "/orgdashboard/request/:id",
  wrapAsync(async (req, res) => {
    const declineReq = await Request.findByIdAndDelete(req.params.id);
    console.log(declineReq);
    res.redirect("/org/orgdashboard");
  }),
);

module.exports = router;
