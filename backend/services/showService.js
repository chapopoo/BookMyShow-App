const Show = require('../model/showModel');
const AppError = require("../utils/AppError");

const addShow = async (data) => {
    if (!data) {
        throw new AppError("All fields are required", 400);
    }
    const newShow = new Show(data)
    await newShow.save()

    return newShow;

};

const deleteShow = async (showID) => {
    if (!showID) {
        throw new AppError("Show ID is required", 400);
    }

    const show = await Show.findById(showID);
    if (!show) {
        throw new AppError("Show not found", 404);
    }
    return await Show.findByIdAndDelete(showID);

}

const updateShow = async (showID, data) => {
    if (!showID) {
        throw new AppError("Show ID is required", 400);
    }
    if (!data) {
        throw new AppError("Show data is required", 400);
    }
    const show = await Show.findById(showID);
    if (!show) {
        throw new AppError("Show not found", 404);
    }
    return await Show.findByIdAndUpdate(showID, data, { new: true });
}

const getAllShowsByTheatre = async (theatreID) => {
    if (!theatreID) {
        throw new AppError("Theatre ID is required", 400);
    }
    return await Show.find({ theatre: theatreID }).populate("movie");
}

const getAllTheatresByMovie = async ({ movie, date }) => {
    // const { movie, date } = data;

    const shows = await Show.find({ movie, date }).populate('theatre');

    // let uniqueTheatres = [];

    // shows.forEach((show) => {
    //     let isTheatre = uniqueTheatres.find(
    //         (theatre) => theatre._id === show.theatre._id
    //     );

    //     if (!isTheatre) {
    //         let showsofThisTheatre = shows.filter(
    //             (showObj) => showObj.theatre._id == show.theatre._id
    //         );
    //         uniqueTheatres.push({
    //             ...show.theatre._doc,
    //             shows: showsofThisTheatre
    //         })
    //     }
    // });

    const theatreMap = new Map();

    shows.forEach((show) => {
        // Convert theatre ID to string for consistent Map key
        const theatreId = show.theatre._id.toString();

        // If the theatre is not already in the Map, add it with an empty shows array
        if (!theatreMap.has(theatreId)) {
            theatreMap.set(theatreId, {
                ...show.theatre._doc,
                shows: []
            });
        }

        // Push the current show into the corresponding theatre's shows array
        theatreMap.get(theatreId).shows.push(show);
    });

    const uniqueTheatres = Array.from(theatreMap.values());
    return uniqueTheatres;

}

const getShowById = async (showID) => {
    if (!showID) {
        throw new AppError("Show ID is required", 400);
    }

    const show = await Show.findById(showID).populate('movie').populate('theatre');

    if (!show) {
        throw new AppError("Show not found", 404);
    }

    return show; // ✅ just return, controller handles response
};

module.exports = {
    addShow,
    deleteShow,
    updateShow,
    getAllShowsByTheatre,
    getAllTheatresByMovie,
    getShowById,
}