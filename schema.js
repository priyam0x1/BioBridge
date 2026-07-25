const Joi = require("joi");

module.exports.donorSchema = Joi.object({
  donor: Joi.object({
    name: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .messages({
        "string.pattern.base": "Name can contain only letters and spaces.",
      }),
    dob: Joi.date().required(),
    phone: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
      }),
    email: Joi.string().email().allow(""),
    address: Joi.string().allow(""),
    blood_grp: Joi.string().allow(""),
    gender: Joi.string().allow(""),
    med_con: Joi.string().allow(""),
    received_date: Joi.date(),
    sample_id: Joi.string(),
    donor_id: Joi.string(),
    HLA_type: Joi.string().allow(""),
    status: Joi.string(),
    test_date: Joi.date(),
    note_org: Joi.string().allow(""),
  }).required(),
});

module.exports.requestSchema = Joi.object({
  request: Joi.object({
    hospital_name: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Hospital name can contain only letters and spaces.",
      }),

    hospital_id: Joi.string(),

    contact_person: Joi.string()
      .pattern(/^[A-Za-z.\s]+$/) // Dr. Priyam Pratim ke liye '.' allow kiya
      .required(),

    contact_detail: Joi.alternatives()
      .try(Joi.string().pattern(/^[6-9]\d{9}$/), Joi.string().email())
      .required(),

    what_needed: Joi.string(),
    typing: Joi.string(),
    patient_ref: Joi.string(),
    urgency: Joi.string(),
    needed_by: Joi.string(),
  }).required(),

  org: Joi.object({
    note: Joi.string().allow(""),
  }).optional(),
});
