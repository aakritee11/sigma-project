const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
  .get(userController.signUp)
  .post(wrapAsync(userController.userPCreate));


router.route("/login")
 .get(userController.login)
 .post(saveRedirectUrl,
  passport.authenticate("local",
  {failureRedirect:'/login',
  failureFlash:true}),
  (userController.userLogin)
);

router.get("/logout",userController.logOut);

module.exports = router;