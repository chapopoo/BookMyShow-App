const express = require('express');
const Theatre = require('../model/theatreModel');
const theatreRouter = express.Router();
const {addTheatre, updateTheatre, deleteTheatre, getAllTheatres, getTheatresByOwner} = require("../controllers/theatreController");

theatreRouter.post('/add-theatre', addTheatre);

theatreRouter.put('/update-theatre', updateTheatre);

theatreRouter.delete('/delete-theatre', deleteTheatre);

theatreRouter.get('/get-all-theatres', getAllTheatres);

theatreRouter.get("/get-all-theatres-by-owner/:ownerID", getTheatresByOwner);

module.exports = theatreRouter;