const express = require('express');
const movieRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { addMovie, getAllMovies, updateMovie, getMovieById, getMoviesBySearchText } = require("../controllers/movieController");

movieRouter.post("/addmovie", authMiddleware, addMovie);

movieRouter.get("/get-all-movies", authMiddleware, getAllMovies);

movieRouter.put("/update-movie", authMiddleware, updateMovie);

movieRouter.get('/movie/:id', authMiddleware, getMovieById);

movieRouter.get("/get-all-movies-by-search-text/:text", authMiddleware, getMoviesBySearchText);

module.exports = movieRouter;
