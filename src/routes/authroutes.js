const express = require("express");
const { linkedInCallback, getUser} = require("../controllers/authController");

const router = express.Router();

router.get("/callback", linkedInCallback);
router.get("/get-user", getUser);


module.exports = router;
