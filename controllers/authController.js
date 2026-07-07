const express = require('express');
const session = require('express-session');
const {check, validationResult} = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {
  res.render("auth/login",{pageTitle: 'Login', currentPage: 'Login Page', isLoggedIn: false, errors:[], oldInput:{email:""}, user: {}});
}

exports.getSignUp = (req,res,next) => {
  res.render("auth/signUp",{pageTitle: 'Login', currentPage: 'Login Page', isLoggedIn: false, errors:[], oldInput:{firstName:"", lastName:"", email:"", userType:""}, user: {}});
}

exports.postLogin = async (req,res,next) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(422).render("auth/login", {
      pageTitle:"login",
      currentPage:"login",
      isLoggedIn:"false",
      errors:["User does not exist"],
      oldInput: {email},
      user: {}
    })
  }
 
const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render("auth/login", {
      pageTitle:"login",
      currentPage:"login",
      isLoggedIn:"false",
      errors:["Invalid password"],
      oldInput: {email},
      user: {}
    })
  }

  req.session.isLoggedIn = true;

  req.session.user = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType
  };

  req.session.save(err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
}

exports.postSignUp = [
  check("firstName")
  .trim()
  .isLength({min:2})
  .withMessage("First name should be atleast 2 characters long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First name should contain only alphabets"),

  check("lastName")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min:8})
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain uppercase characters")
  .matches(/[a-z]/)
  .withMessage("Password should contain lowercase characters")
  .matches(/[0-9]/)
  .withMessage("Password should contain numbers")
  .matches(/[!@#$%^&*]/)
  .withMessage("Password should contain special characters"),

  check("confirmPassword")
  .trim()
  .custom((value,{req}) => {
    if(value != req.body.password){
      throw new Error("Password not matched") 
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type"),

  check("terms")
  .notEmpty()
  .custom((value,{req}) => {
    if(!value){
      throw new Error("Please accept the terms and conditions")
    }
    return true;
  }),

  
  (req,res,next) => {
    const {firstName,lastName,email,password, userType} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render("auth/signUp", {
        pageTitle:"signUp",
        currentPage:"signUp",
        isLoggedIn:"false",
        errors:errors.array().map(err => err.msg),
        oldInput: {firstName,lastName,email,password,userType},
        user: {}
      })
    }

    bcrypt.hash(password, 12).then(async hashedPassword => {
      const test = await bcrypt.compare(password, hashedPassword);     
      const user = new User({firstName,lastName,email,password:hashedPassword,userType});
      user.save();
    })
    .then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render("auth/signUp", {
        pageTitle:"signUp",
        currentPage:"signUp",
        isLoggedIn:"false",
        errors: [err.message],
        oldInput: {firstName,lastName,email,password,userType},
        user: {}
      });
    });
  }
]

exports.postLogout =  (req,res,next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
  
}