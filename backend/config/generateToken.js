const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "hhhhhhahahhahannaahhahahaaas", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
