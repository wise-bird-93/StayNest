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

module.exports = mongoose.model('Home', model);
