const express = require('express');
const authRoute = express.Router();

const {getLogin, postLogin, postLogout,getSignUp, postSignUp} = require('../controllers/authController')

authRoute.get("/login", getLogin);
authRoute.post("/login", postLogin);
authRoute.post("/logout", postLogout);
authRoute.get("/signUp", getSignUp);
authRoute.post("/signUp", postSignUp);

exports.authRoute = authRoute;