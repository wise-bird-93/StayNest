const Home = require('../models/home') 
const Favourites = require('../models/favourites'); 

// hostRoute
exports.getAddHome = (req,res,next) => {
  Home.fetchAll().then(([homes]) => {
    res.render('store/home-list',{registeredHomes: homes,pageTitle: 'Add Home to airbnb',currentPage: 'addHome'}); 
  });
}

exports.getBookings = (req,res,next) => {
  res.render('store/booking',{pageTitle: 'My Bookings',currentPage: 'booking'}); 
};

const favouriteHomes = [];
exports.addFavourite = (req, res) => { 
  const homeId = req.body.id;
  Favourites.addFavourite(homeId,status => {
    if (status === "already-exists") {
      Home.fetchAll().then(([homes]) => {
        const home = homes.findById(homeId);

        return res.render("host/home-details", {
          home: home,
          pageTitle: home.houseName,
          currentPage: "Favourites"
          
        });
      });

      return;
    }

    res.redirect("/favourites");
  });
}

exports.getFavoriteList = (req,res,next) => {
  Favourites.getFavourite(favourites => {
    res.render('store/favourite',{registeredHomes:favourites, pageTitle: 'My Favorites',currentPage: 'favourites'}); 
  })
  
}

exports.deleteHome = (req,res,next) => {
  const id = req.params.homeId;
  Favourites.delete(id);
  res.redirect("/");
}