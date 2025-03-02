const express = require("express");
const { linkedInCallback, getUser} = require("../controllers/authController");

const AuthRoutes = express.Router();

AuthRoutes.get("/callback", linkedInCallback);
AuthRoutes.get("/get-user", getUser);


module.exports = AuthRoutes;
