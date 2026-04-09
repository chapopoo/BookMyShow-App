const showService = require("../services/showService");

const addShow = async (req, res) => {
    try {
        await showService.addShow(req.body);

        res.send({
            success: true,
            message: "Show added successfully",
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const deleteShow = async (req, res) => {
    try {
        await showService.deleteShow(req.body.showID);

        res.send({
            success: true,
            message: "Show deleted successfully",
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const updateShow = async (req, res) => {
    try {
        await showService.updateShow(req.body.showID, req.body);
        res.send({
            success: true,
            message: "Show updated successfully",
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const getAllShowsByTheatre = async (req, res) => {
    try {
        const shows = await showService.getAllShowsByTheatre(req.body.theatreID);
        res.send({
            success: true,
            message: "Shows fetched successfully",
            data: shows
        })
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const getAllTheatreByMovie = async (req, res) => {
    try {
        const { movie, date } = req.body;
        const theatres = await showService.getAllTheatreByMovie(movie, date);
        res.send({
            success: true,
            message: "Theatres fetched successfully",
            data: theatres
        })
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const getShowById = async (req, res) => {
    try {
        const show = await showService.getShowById(req.body.showID);
        res.send({
            success: true,
            message: "Show fetched successfully",
            data: show
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
    addShow,
    deleteShow,
    updateShow,
    getAllShowsByTheatre,
    getAllTheatreByMovie,
    getShowById,
}