const Movie = require("../model/movieModel");
const AppError = require("../utils/AppError");

const addMovie = async (data) => {
    if (!data) {
        throw new AppError("All fields are required", 400);
    }
    const newMovie = new Movie(data);
    await newMovie.save();
    return newMovie;
};

const getAllMovies = async () => {
    return await Movie.find({});
};

const updateMovie = async (movieID, data) => {
    if (!movieID) {
        throw new AppError("Movie ID is required", 400);
    }
    const updatedMovie = await Movie.findByIdAndUpdate(movieID, data, { new: true });
    return updatedMovie;
};

const getMovieById = async (id) => {
    if (!id) {
        throw new AppError("Movie ID is required", 400);
    }
    const movie = await Movie.findById(id);
    if (!movie) {
        throw new AppError("Movie not found", 404);
    }   
    return movie;
};

const getMoviesBySearchText = async (text) => {
    if (!text || text === "undefined") {
        throw new AppError("Search text is required", 400);
    }
    return await Movie.find({
        "movieName": { $regex: text, $options: "i" } // Case-insensitive search for movie name 
    });
}

module.exports = {
    addMovie,
    getAllMovies,
    updateMovie,
    getMovieById,
    getMoviesBySearchText,
}