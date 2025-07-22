const mongoose = require("mongoose")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

// const favorite = new mongoose.Schema({
//     title: String,
//     location: String,
//     description: String,
//     image: [{
//         url: {
//             type: String,
//             required: true
//         },
//         cloudinary_id: {
//             type: String,
//             required: true
//         },
//         title: {
//             type: String,
//             required: true
//         }
//     }],
//     adder: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     comments: [commentSchema],
// })


const listingSchema = new Schema({
    title: String,
    location: String,
    description: String,
    image: [{
        url: {
            type: String,
            required: true
        },
        cloudinary_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    }],
    adder: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [commentSchema],
}, {
    timestamps: true
})

module.exports = mongoose.model("Listing", listingSchema)