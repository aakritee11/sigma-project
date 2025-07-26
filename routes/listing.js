const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

router.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,
  
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.create)
)


//New Route 
router.get("/new",isLoggedIn,listingController.new);

router.route("/:id")
 .get(wrapAsync (listingController.show))
 .put(isLoggedIn
  ,isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync( listingController.update)
  )
 .delete(isLoggedIn ,
  isOwner, 
  wrapAsync (listingController.delete)
); 


//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.edit)
);

module.exports=router;