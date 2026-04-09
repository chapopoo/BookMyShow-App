const Theatre = require("../model/theatreModel");
const AppError = require("../utils/AppError");

// Create
const addTheatre = async (data) => {
    if (!data.name || !data.address || !data.owner) {
        throw new AppError("All fields are required", 400);
    }

    const theatre = new Theatre(data);
    await theatre.save();
    return theatre;
};

// Update
const updateTheatre = async (theatreID, data) => {
    if (!theatreID) {
        throw new AppError("Theatre ID is required", 400);
    }

    const theatre = await Theatre.findById(theatreID);
    if (!theatre) {
        throw new AppError("Theatre not found", 404);
    }

    const updated = await Theatre.findByIdAndUpdate(theatreID, data, { new: true });
    return updated;
};

// Delete
const deleteTheatre = async (theatreID) => {
    if (!theatreID) {
        throw new AppError("Theatre ID is required", 400);
    }

    const theatre = await Theatre.findById(theatreID);
    if (!theatre) {
        throw new AppError("Theatre not found", 404);
    }
    return await Theatre.findByIdAndDelete(theatreID);
};

// Get all
const getAllTheatres = async () => {
    // This will by default omit all reference fields
    // When we populate the owner, EVERY field from Owner is included
    // this will populate the owner field with the corresponding user document or object from the users collection
    return await Theatre.find().populate("owner", "name");
};

// Get by owner
const getTheatresByOwner = async (ownerID) => {
    if (!ownerID) {
        throw new AppError("Owner ID is required", 400);
    }
    console.log(ownerID);
    return await Theatre.find({ owner: ownerID });
};

module.exports = {
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getTheatresByOwner
};