const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqSchema = new Schema({
  hospital_name: {
    type: String,
    required: true,
  },
  hospital_id: {
    type: String,
  },
  contact_person: {
    type: String,
    required: true,
  },
  contact_detail: {
    type: String,
    required: true,
  },
  what_needed: {
    type: String,
  },
  HLA_type: {
    type: String,
  },
  blood_group: {
    type: String,
  },
  patient_ref: {
    type: String,
  },
  urgency: {
    type: String,
  },
  needed_by: {
    type: String,
  },
  org_note: {
    type: String,
  },
});

const Request = mongoose.model("Request", reqSchema);
module.exports = Request;
