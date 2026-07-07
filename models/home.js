const mongoose = require("mongoose");

const model = new mongoose.Schema({
    houseName: {type: String, required:true},
    description: String,
    price: {type: String, required:true},
    location: {type: String, required:true},
    rating: {type: Number, required:true},
    photo: String,
    rules: String
})

// model.pre('findOneAndDelete', async function(next) {
//     const homeId = this.getQuery()._id;
//     await favourites.deleteMany({homeId:homeId});
    
// });

module.exports = mongoose.model('Home', model);
