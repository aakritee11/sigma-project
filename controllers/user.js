
const User = require("../models/user");

module.exports.signUp = (req,res)=>{
  res.render("users/signup.ejs");
}

module.exports.userPCreate = async(req,res)=>{
  try {
    let {username,email,password}= req.body;
  const newUser = new User({email,username});
  const registeredUser = await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
     return next(err);
    }
    req.flash("success",`Welcome to WanderLust! ${username}`);
    res.redirect("/listings");
  });
 
  } catch (e) {
    req.flash("error",e.message);
    res.redirect("/signup");
  } 
};

module.exports.login = (req,res)=>{
  res.render("users/login.ejs");
};

module.exports.userLogin = async(req,res)=>{
 req.flash("success","Welcome back to WanderLust!");
 res.redirect("/listings");
};

module.exports.logOut = (req,res,next)=>{
  req.logOut((err)=>{
    if (err){
      return next(err);
    }
    req.flash("success","logged you out");
    res.redirect("/listings");
  })
};
