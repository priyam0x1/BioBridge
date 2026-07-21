const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema({
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
  sample_id: {
    type: String,
  },
  donor_id: {
    type: String,
  },
});

const Donor = mongoose.model("Donor", donorSchema);
module.exports = Donor;
