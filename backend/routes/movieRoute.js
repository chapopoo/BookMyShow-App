const express = require('express');
const movieRouter = express.Router();
const Movie = require("../model/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");
const { addMovie, getAllMovies, updateMovie, getMovieById } = require("../controllers/movieController");

//route to add a new movie, only accessible to authenticated users
movieRouter.post("/addmovie", authMiddleware, addMovie);

//List all movies
movieRouter.get("/get-all-movies", authMiddleware, getAllMovies);

//Update a movie
movieRouter.put("/update-movie", authMiddleware, updateMovie);

// get details of single movie by its id 
movieRouter.get('/movie/:id', authMiddleware, getMovieById);

//get all movies via search text
movieRouter.get("/get-all-movies-by-search-text/:text", authMiddleware, async (req, res) => {
    try {
        if (req.params.text && req.params.text !== "undefined") {
            const movies = await Movie.find({
                "movieName": { $regex: req.params.text, $options: "i" } // Case-insensitive search for movie name
            });

            res.send({
                success: true,
                message: "Movie fetched successfully",
                movies
            })
        }
        else {
            const movies = await Movie.find();

            res.send({
                success: true,
                message: "Movies fetched successfully",
                movies
            })
        }
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
});

module.exports = movieRouter;
