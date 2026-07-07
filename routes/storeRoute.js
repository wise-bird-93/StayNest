const express = require('express');
const storeRouter = express.Router();
const path = require('path');
const routePath = require('../utils/pathUtil');
const {registeredHomes} = require('./hostRoute');
const {viewHomes} = require('../controllers/hostController')
const {getBookings, getFavoriteList, addFavourite, deleteFavourite, getRules} = require('../controllers/storeController')

storeRouter.get("/",viewHomes);
storeRouter.get("/bookings",getBookings);
storeRouter.post("/favourites",addFavourite);
storeRouter.get("/favourites",getFavoriteList);
storeRouter.get("/deleteFavourites/:homeId", deleteFavourite);
storeRouter.get("/rules/:homeId", getRules);

exports.storeRouter = storeRouter;