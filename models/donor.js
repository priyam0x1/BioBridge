const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  name: {
    type: String,
    required: true,
    match: /^[A-Za-z ]+$/,
  },
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits."],
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  blood_grp: {
    type: String,
  },
  gender: {
    type: String,
  },
  med_con: {
    type: String,
  },
  received_date: {
    type: Date,
  },
  sample_id: {
    type: String,
  },
  donor_id: {
    type: String,
  },
  HLA_type: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  test_date: {
    type: Date,
  },
  note_org: {
    type: String,
  },
});

const Donor = mongoose.model("Donor", donorSchema);
module.exports = Donor;
