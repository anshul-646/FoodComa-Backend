const { registerUser } = require("../service/userService");

async function createUser(req, res) {
  try {
    const response = await registerUser(req.body);
    return res.status(201).json({
      message: "Successfully registered a user",
      success: true,
      data: response,
      error: {}
    });
  } catch (e) {
    console.error("Error in createUser:", e);

    const status = e.statusCode || 500;
    const message = e.reason || e.message || "Internal server error";

    return res.status(status).json({
      message,
      success: false,
      data: {},
      error: e
    });
  }
}

module.exports = { createUser };
