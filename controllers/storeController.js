const Home = require('../models/home'); 
const User = require('../models/user');
const path = require('path');
const routePath = require('../utils/pathUtil');

// hostRoute
exports.getAddHome = (req,res,next) => {
  Home.fetchAll().then(homes => {
    res.render('store/home-list',{registeredHomes: homes,pageTitle: 'Add Home to airbnb',currentPage: 'addHome', isLoggedIn: req.isLoggedIn}); 
  });
}

exports.getBookings = (req,res,next) => {
  res.render('store/booking',{pageTitle: 'My Bookings',currentPage: 'booking', isLoggedIn: req.isLoggedIn}); 
};

exports.addFavourite = async (req, res) => { 
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }
  
  res.redirect("/favourites");
}

exports.getFavoriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');

  res.render("store/favourite", {
    registeredHomes: user.favourites,
    pageTitle: "My Favorites",
    currentPage: "favourites", 
    isLoggedIn: req.isLoggedIn
  });
};

exports.deleteFavourite = async (req,res,next) => {
  const id = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites = user.favourites.filter(f => f != f.homeId);
    await user.save();
  }
  res.redirect("/favourites");
}

exports.getRules = [(req,res,next) => {
  if(!req.session.isLoggedIn){
    res.redirect("/login");
  }
  next();
},

async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home || !home.rules) {
      return res.status(404).send("Rules file not found");
    }
    res.download(home.rules);
  } catch (err) {
    next(err);
  }
}
];