const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    // this will store the id of the user who is the owner of the theater
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    isActive:{
        type:Boolean,
        default:false,
    }
},
{timestamps:true}, // this will automatically add createdAt and updatedAt fields to the document
)

// this will create a collection named theaters in the database and the documents in that collection will follow the theaterSchema
const Theater = mongoose.model('theaters', theaterSchema);
mongoose.model.exports = Theater;