const Home = require('../models/home') 
const fs = require('fs') 

// hostRoute
exports.getAddHome = (req,res,next) => {
  Home.find().then(homes => {
    res.render('store/home-list',{registeredHomes: homes,pageTitle: 'Add Home to airbnb',currentPage: 'addHome', isLoggedIn: req.isLoggedIn, user: req.session.user}); 
  });
}

exports.editHome = (req,res,next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {

    if(!home){
      console.log("Home Not Found");
      return res.redirect("/");
    }
    else {
      res.render('host/editHome',{home: home, pageTitle: "EditHome" ,currentPage: "EditHome", isLoggedIn: req.isLoggedIn, user: req.session.user}); 
    }  
  }).catch(err => console.log(err));
  
}

exports.saveUpdatedHome = (req,res,next) => {
  const homeId = req.params.homeId;
  const {houseName, description, price, location, rating} = req.body;

  Home.findById(homeId).then((home) => {
    home.houseName = houseName;
    home.description = description;
    home.price = price;
    home.location = location;
    home.rating = rating;

    if(req.file){
      fs.unlink(home.photo, (err) => {
        if (err) {
          console.log("Error while deleting file ", err);
        }
      });
      home.photo = req.file.path;

    }

    home.save().then(result => {
      console.log("Home Updated", result);
      res.redirect("/");
    }).catch(err => console.log(err));
  })
}

exports.deleteHome = (req,res,next) => {
  const id = req.params.homeId;
  Home.findByIdAndDelete(id).then(() => {
    res.redirect("/");
  }).catch(err => {
    console.log(err);
    res.redirect("/");
  });
}

exports.postHome = (req,res,next) => {
  const {houseName, description, price, location, rating} = req.body;

  if(!req.files || !req.files.photo){
    return res.status(422).send("No image given");
  }

  const photo = req.files.photo[0].path;
  const rules = req.files.rules[0].path;

  const home = new Home({houseName, description, price, location, rating, photo, rules});

  home.save().then(() => {
    console.log("Home saved Successfully");
  });

  res.render('host/homeAdded',{pageTitle: 'Home added successfully',currentPage: 'HomeAdded'});
}

//userRoute
exports.viewHomes = (req,res,next) => {
  Home.find().then(registeredHomes => {
    res.render('host/home',{registeredHomes: registeredHomes, pageTitle: 'airbnb home', currentPage: 'Home', isLoggedIn: req.isLoggedIn, user: req.session.user});
  });
  
}

exports.getHomeDetails = (req,res,next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(homes => {
      if (!homes) {
        console.log("Home Not Found");
        return res.redirect("/");
      }
      else {
        res.render('host/home-details',{home: homes, pageTitle: homes.houseName, currentPage: 'HomeDetail', isLoggedIn: req.isLoggedIn, user: req.session.user});
      }
    }).catch(err => console.log(err));

}

