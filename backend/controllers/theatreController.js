const theatreService = require("../services/theatreService");

// Add
const addTheatre = async (req, res) => {
    try {
        await theatreService.addTheatre(req.body);

        res.send({
            success: true,
            message: "New theatre has been added!"
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};

// Update
const updateTheatre = async (req, res) => {
    try {
        await theatreService.updateTheatre(req.body.theatreID, req.body);

        res.send({
            success: true,
            message: "Theatre has been updated!"
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
};

// Delete
const deleteTheatre = async (req, res) => {
    try {
        await theatreService.deleteTheatre(req.body.theatreID);

        res.send({
            success: true,
            message: "Theatre has been deleted!"
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
};

// Get all
const getAllTheatres = async (req, res) => {
    try {
        const theatres = await theatreService.getAllTheatres();

        res.send({
            success: true,
            message: "Theatres fetched successfully!",
            data: theatres
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
};

// Get by owner
const getTheatresByOwner = async (req, res) => {
    try {
        const theatres = await theatreService.getTheatresByOwner(req.params.ownerID);

        res.send({
            success: true,
            message: "Theatres by owner fetched!",
            data: theatres
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getTheatresByOwner
};