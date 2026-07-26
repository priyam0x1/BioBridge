const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { donorSchema, requestSchema } = require("../schema.js");
const Donor = require("../models/donor.js");
const Request = require("../models/request.js");

const validateDonor = (req, res, next) => {
  let { error } = donorSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

const validateRequest = (req, res, next) => {
  let { error } = requestSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Public main page
router.get("/", (req, res) => {
  res.render("public/public.ejs", { currentPage: "public" });
});

// register form - new donor
router.get("/register", (req, res) => {
  res.render("public/register.ejs", { currentPage: "donor" });
});

// Hospital login
router.get("/hospitallogin", (req, res) => {
  res.render("public/hospitalLogin.ejs", { currentPage: "hospital" });
});

// Hospital Form Request
router.get("/request", (req, res) => {
  res.render("public/request.ejs", { currentPage: "hospital" });
});

// register form - donor submit
router.post(
  "/org",
  validateDonor,
  wrapAsync(async (req, res, next) => {
    const donor = req.body.donor;
    donor.sample_id = uuidv4();
    donor.donor_id = uuidv4();
    donor.received_date = new Date();
    donor.status = "Pending";
    const newDonor = new Donor(donor);
    await newDonor.save();
    res.render("public/thankDonor.ejs", { newDonor, currentPage: "donor" });
  }),
);

// Hospital Request Store
router.post(
  "/org/orgdashboard",
  validateRequest,
  wrapAsync(async (req, res) => {
    const request = req.body.request;
    if (request.what_needed === "Blood donor") {
      request.blood_group = request.typing;
    } else if (request.what_needed === "Stem cell donor") {
      request.HLA_type = request.typing;
    }

    const newRequest = new Request(request);
    await newRequest.save();

    res.render("public/thankHospital.ejs", { currentPage: "hospital" });
  }),
);

module.exports = router;
