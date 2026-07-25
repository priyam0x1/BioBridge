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
