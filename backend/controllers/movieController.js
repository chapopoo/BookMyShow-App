const movieService = require("../services/movieService");

const addMovie = async (req, res) => {
    try {
        await movieService.addMovie(req.body);

        res.send({
            success: true,
            message: "Movie added successfully",
        })
    }   
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();       
        res.send({
            success: true,
            message: "Movies fetched successfully",
            movies
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const updateMovie = async (req, res) => {
    try {
        await movieService.updateMovie(req.body.movieID, req.body);
        res.send({
            success: true,
            message: "Movie updated successfully",
        })
    }   
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        res.send({
            success: true,
            message: "Movie fetched successfully",
            movie
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};


module.exports = {
    addMovie,
    getAllMovies,
    updateMovie,
    getMovieById,
}