const mongoose = require("mongoose");

const movieScemaRules = new mongoose.Schema({
    movieName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    poster: {
        type: String,
        required: true
    }
});

const Movies = mongoose.model("movies", movieScemaRules); //movies is the collection name in the database

module.exports = Movies;