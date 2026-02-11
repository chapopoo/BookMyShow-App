const express = require('express');
const Theater = require('../model/theaterModel');
const theaterRouter = express.Router();

theaterRouter.post('/add-theatre', async (req, res) => {
    try{
        const newTheater = new Theater(req.body);
        await newTheater.save();

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

theaterRouter.put('/update-theatre', async (req, res) => {
    try{
        await Theater.findByIdAndUpdate(req.body.theaterID, req.body);

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

theaterRouter.delete('/delete-theatre', async (req, res) => {
    try{
        await Theater.findByIdAndDelete(req.body.theaterID);

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

theaterRouter.get('/get-all-theatres', async (req, res) => {
    try{
        // This will by default omit all reference fields
        // When we populate the owner, EVERY field from Owner is included
        // this will populate the owner field with the corresponding user document or object from the users collection
        const allTheaters = await Theater.find().populate("owner");

        res.send({
            success:true,
            message:"Theatres fetched Successfully!",
            allTheaters
        })
    }
    catch(err){
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
});

theaterRouter.get("/get-all-theatres-by-owner/:ownerID", async (req, res) => {
    try{
        const allTheatresByOwner = await Theater.find({owner: req.params.ownerID});

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
