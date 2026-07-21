const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confirmDonorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
  test_date: {
    type: Date,
  },
  status: {
    type: String,
  },
  HLA_type: {
    type: String,
  },
  sample_id: {
    type: String,
  },
  donor_id: {
    type: String,
  },
  note_org: {
    type: String,
  },
});

const ConfirmDonor = mongoose.model("ConfirmDonor", confirmDonorSchema);
module.exports = ConfirmDonor;
