const showRouter = require('express').Router();
const Show = require('../model/showModel');
const authMiddleware = require('../middlewares/authMiddleware');

showRouter.post('/add-show', authMiddleware, async (req, res) => {
    try {
        const newShow = new Show(req.body)
        await newShow.save()

        res.send({
            success: true,
            message: "Show added successfully",
            data: newShow
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
});

showRouter.post('/delete-show', authMiddleware, async (req, res) => {
    try {
        await Show.findByIdAndDelete(req.body.showID);

        res.send({
            success: true,
            message: "Show deleted successfully!"
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

showRouter.put('/update-show', authMiddleware, async (req, res) => {
    try {
        await Show.findByIdAndUpdate(req.body.showID, req.body)

        res.send({
            success: true,
            message: "show has been updated!"
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

showRouter.post('/get-all-shows-by-theatre', authMiddleware, async (req, res) => {
    try {
        const shows = await Show.find({ theatre: req.body.theatreID }).populate("movie");

        res.send({
            success: true,
            message: "all shows fetched!",
            data: shows
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }

})

showRouter.post('/get-all-theatre-by-movie', authMiddleware, async (req, res) => {
    try {
        const { movie, date } = req.body;

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

        res.send({
            success: true,
            message: "All theatres fetched!",
            data: uniqueTheatres,
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

showRouter.post('/get-show-by-id', authMiddleware, async (req, res) => {
    try{
        const show = await Show.findById(req.body.showID).populate('movie').populate('theatre');

        res.send({
            success: true,
            message: "All Shows fetched!",
            data: show,
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
});

module.exports = showRouter;