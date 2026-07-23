const express = require('express');
const storeRouter = express.Router();
const path = require('path');
const routePath = require('../utils/pathUtil');
const {registeredHomes} = require('./hostRoute');
const {viewHomes} = require('../controllers/hostController')
const {getBookings, getFavoriteList, addFavourite, deleteFavourite, getRules, bookHome,getBookingForm, deleteBooking} = require('../controllers/storeController')

storeRouter.get("/",viewHomes);
storeRouter.get("/bookings",getBookings);
storeRouter.post("/favourites",addFavourite);
storeRouter.get("/favourites",getFavoriteList);
storeRouter.get("/deleteFavourites/:homeId", deleteFavourite);
storeRouter.get("/rules/:homeId", getRules);
storeRouter.get("/book/:homeId",getBookingForm);
storeRouter.post("/book/:homeId",bookHome);
storeRouter.get("/deleteBookings/:homeId",deleteBooking);

exports.storeRouter = storeRouter;