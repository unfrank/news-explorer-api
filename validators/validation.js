const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (
    validator.isURL(value, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateRegisterBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

module.exports.validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().messages({
      "string.empty": "Keyword is required",
    }),
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),
    text: Joi.string().required().messages({
      "string.empty": "Text is required",
    }),
    date: Joi.string().required().messages({
      "string.empty": "Date is required",
    }),
    source: Joi.string().required().messages({
      "string.empty": "Source is required",
    }),
    link: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Link is required",
      "string.uri": "Link must be a valid URL",
    }),
    image: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image must be a valid URL",
    }),
  }),
});

module.exports.validateArticleId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid article ID format",
      "string.length": "Article ID must be 24 characters long",
    }),
  }),
});
