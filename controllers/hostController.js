const Home = require('../models/home')  

// hostRoute
exports.getAddHome = (req,res,next) => {
  Home.fetchAll().then(([homes]) => {
    res.render('store/home-list',{registeredHomes: homes,pageTitle: 'Add Home to airbnb',currentPage: 'addHome'}); 
  });
}

exports.editHome = (req,res,next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(([home]) => {
    console.log("HOME DATA:", home);
      console.log("FIRST ROW:", home[0]);

    if(home.length === 0){
      console.log("Home Not Found");
      return res.redirect("/");
    }
    else {
      res.render('host/editHome',{home: home[0], pageTitle: "EditHome" ,currentPage: "EditHome"}); 
    }  
  }).catch(err => console.log(err));
  
}

exports.saveUpdatedHome = (req,res,next) => {
  const homeId = req.params.homeId;
  const {houseName, description, price, location, rating, photoURL} = req.body;
  
  Home.update(
        homeId,
        houseName,
        description,
        price,
        location,
        rating,
        photoURL
    )
    .then(() => {
        res.redirect("/");
    })
    .catch(err => console.log(err));
}

exports.deleteHome = (req,res,next) => {
  const id = req.params.homeId;
  Home.delete(id).then(() => {
    res.redirect("/");
  }).catch(err => {
    console.log(err);
    res.redirect("/");
  });
}

exports.postHome = (req,res,next) => {
  console.log(req.body);
  const {houseName, description, price, location, rating, photoURL} = req.body;
  const home = new Home(houseName, description, price, location, rating, photoURL);
  home.save();

  res.render('host/homeAdded',{pageTitle: 'Home added successfully',currentPage: 'HomeAdded'});
}

//userRoute
exports.viewHomes = (req,res,next) => {
  Home.fetchAll().then(([registeredHomes]) => {
    res.render('host/home',{registeredHomes: registeredHomes, pageTitle: 'airbnb home', currentPage: 'Home'});
  });
  
}

exports.getHomeDetails = (req,res,next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(([homes]) => {
      if (homes.length === 0) {
        console.log("Home Not Found");
        return res.redirect("/");
      }
      else {
        const home = homes[0];
        res.render('host/home-details',{home: home, pageTitle: home.houseName, currentPage: 'HomeDetail'});
      }
    }).catch(err => console.log(err));

}