const express = require('express');
const movieRouter = express.Router();
const Movie = require("../model/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");

//route to add a new movie, only accessible to authenticated users
movieRouter.post("/addmovie", authMiddleware, async (req, res) => {
    try{
        const newMovie = new Movie(req.body);

        await newMovie.save(); //saving the new movie to the database

        res.send({
            success: true,
            message: "Movie added successfully",
            data: newMovie
        })
    }
    catch(err){
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
});

//List all movies
movieRouter.get("/get-all-movies", authMiddleware, async (req, res) => {
    try{
        const movies = await Movie.find();

        res.send({
            success: true,
            message: "Movies fetched successfully",
            movies
        })
    }
    catch(err){
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err
            
        })
    }
});


//Update a movie
movieRouter.put("/update-movie", authMiddleware, async (req, res) => {
    try{
        const movie = await Movie.findOneAndUpdate(req.body.movieId, req.body);

        res.send({
            success: true,
            message: "Movie updated successfully",
            movie
        })
    }
    catch(err){
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err
            
        })
    }
});

module.exports = movieRouter;
