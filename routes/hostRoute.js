const express = require('express');
const hostRouter = express.Router();
const path = require('path');
const routePath = require('../utils/pathUtil');
const {getAddHome,postHome,getHomeDetails, editHome, saveUpdatedHome, deleteHome} = require('../controllers/hostController');
 

hostRouter.get("/host/admin", getAddHome);
hostRouter.post("/host/admin", postHome);
hostRouter.get("/viewHome/:homeId", getHomeDetails);
hostRouter.get("/editHome/:homeId", editHome);
hostRouter.post("/host/editHome/:homeId", saveUpdatedHome);
hostRouter.get("/delete/:homeId", deleteHome);

exports.hostRouter = hostRouter;
