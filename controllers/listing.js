const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) =>{
  const alllistings = await Listing.find({});
   res.render("listings/index.ejs",{alllistings});
};

module.exports.new = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.show = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate("owner")
  .populate({path:"reviews",
    populate:{
      path:"author"
    }
  })
  
  if(!listing){
    req.flash("error","listing you requested for doesn't exist");
    return res.redirect("/listings");
  };
  
  console.log("listing.owner:", listing.owner);
console.log("req.user:", req.user);
console.log("res.locals.currUser:", res.locals.currUser);

  res.render("listings/show.ejs", { listing });

}

module.exports.create = async (req,res,next)=>{

  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  let url = req.file.path;
  let filename = req.file.filename;
     const newListing= new Listing (req.body.listing);
     newListing.owner =  req.user._id;
     newListing.image = {url,filename};

     newListing.geometry = response.body.features[0].geometry;

    let savedListing =  await newListing.save();
    console.log(savedListing);
     req.flash("success","New Listing Created!");
     res.redirect("/listings");
};

  module.exports.edit =  async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs",{listing,originalImgUrl});
 }

module.exports.update = async(req,res)=>{
  let {id} = req.params;
 let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save(); 
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};