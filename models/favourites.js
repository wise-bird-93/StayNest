const fs = require('fs');
const path = require('path');
const routePath = require('../utils/pathUtil');
const Home = require('./home')
const favouriteDataPath = path.join(routePath, 'data', 'favourites.json');

module.exports = class Favourite {
  static addFavourite(homeId, callback){
    Favourite.getFavourite(favourite => {
      const alreadyExists = favourite.some(h => h.id === homeId);

      if (alreadyExists) {
        return callback("already-exists");
      }

      Home.fetchAll(homes => {
        const home = homes.find(h => h.id === homeId);

        favourite.push(home);

        fs.writeFile(
          favouriteDataPath,
          JSON.stringify(favourite),
          () => callback("added")
        );
      });
    });  
  }

  static getFavourite(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      if (!err) callback(JSON.parse(data));
      else callback([]);
    });
  }

  static saveAll(registeredHomes) {
    fs.writeFile(favouriteDataPath, JSON.stringify(registeredHomes),err => console.log(err));
  }

  static delete(id) {
    Favourite.getFavourite(homes => {
      const updatedHomes = homes.filter(h => h.id != id);
      Favourite.saveAll(updatedHomes);
    })
  }
}