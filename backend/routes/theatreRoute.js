const express = require('express');
const Theatre = require('../model/theatreModel');
const theatreRouter = express.Router();

theatreRouter.post('/add-theatre', async (req, res) => {
    try{
        const newTheatre = new Theatre(req.body);
        await newTheatre.save();

        res.send({
            success:true,
            message:"New theatre has been added!"
        })
    }
    catch(err){
        return res.send({
            success: false,
            message: err.message
        })
    }
})

theatreRouter.put('/update-theatre', async (req, res) => {
    try{
        await Theatre.findByIdAndUpdate(req.body.theatreID, req.body);

        res.send({
            success:true,
            message:"Theatre has been updated!"
        })
    }
    catch(err){
        return res.send({
            success: false,
            message: err.message
        })
    }
})

theatreRouter.delete('/delete-theatre', async (req, res) => {
    try{
        await Theatre.findByIdAndDelete(req.body.theatreID);

        res.send({
            success:true,
            message:"Theatre has been deleted!"
        })
    }
    catch(err){
        return res.send({
            success: false,
            message: err.message
        })
    }
});

theatreRouter.get('/get-all-theatres', async (req, res) => {
    try{
        // This will by default omit all reference fields
        // When we populate the owner, EVERY field from Owner is included
        // this will populate the owner field with the corresponding user document or object from the users collection
        const allTheatres = await Theatre.find().populate("owner");

        res.send({
            success:true,
            message:"Theatres fetched Successfully!",
            allTheatres
        })
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
});

theatreRouter.get("/get-all-theatres-by-owner/:ownerID", async (req, res) => {
    try{
        const allTheatresByOwner = await Theatre.find({owner: req.params.ownerID});

        console.log(req.params.ownerID, allTheatresByOwner)

        res.send({
            success: true,
            message: "Theatres by owners fetched!",
            allTheatresByOwner
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
        })
    }
})

module.exports = theatreRouter;