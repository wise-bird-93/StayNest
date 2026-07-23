const Home = require('../models/home'); 
const User = require('../models/user');
const Booking = require("../models/booking");
const path = require('path');
const routePath = require('../utils/pathUtil');

// hostRoute
exports.getAddHome = (req,res,next) => {
  Home.fetchAll().then(homes => {
    res.render('store/home-list',{registeredHomes: homes,pageTitle: 'Add Home to airbnb',currentPage: 'addHome', isLoggedIn: req.isLoggedIn}); 
  });
}

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
  user.favourites = user.favourites.filter(
    fav => fav.toString() !== id
  );

  await user.save();
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

exports.bookHome = async (req, res, next) => {
    try {
        const homeId = req.params.homeId;
        const userId = req.session.user._id;

        const user = await User.findById(userId);

        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(req.body.checkOut);

        if (checkOut <= checkIn) {
          return res.send("Check-out date must be after Check-in date.");
        }

        const existingBooking = await Booking.findOne({
            home: homeId,
            checkIn: {
              $lt: checkOut
            },
            checkOut: {
              $gt: checkIn
            }
        });

        if (existingBooking) {
          return res.render("store/booking-form", {
            home: await Home.findById(homeId),
            user,
            pageTitle: "Book Home",
            currentPage: "booking",
            isLoggedIn: req.isLoggedIn,
            error: "This home is already booked for the selected dates."
          });
        }

        const booking = new Booking({
            home: homeId,
            user: userId,
            name: user.firstName + " " + user.lastName,
            email: user.email,
            mobile: req.body.mobile,
            checkIn,
            checkOut
        });

        await booking.save();

        res.redirect("/bookings");

    } catch (err) {
        next(err);
    }
};

exports.getBookings = async (req, res, next) => {
    try {
        const userId = req.session.user._id;

        const bookings = await Booking.find({ user: userId })
            .populate("home");

        res.render("store/booking", {
            bookings,
            pageTitle: "My Bookings",
            currentPage: "booking",
            isLoggedIn: req.isLoggedIn
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteBooking = async (req,res,next) => {
  const id = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  user.bookings = user.bookings.filter(
    book => book.toString() !== id
  );

  await user.save();
  res.redirect("/bookings");
}

exports.getBookingForm = async (req, res) => {
    const home = await Home.findById(req.params.homeId);

    res.render("store/booking-form", {
        pageTitle: "Book Home",
        currentPage: "booking",
        isLoggedIn: req.isLoggedIn,
        home,
        user: req.session.user
    });
};