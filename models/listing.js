const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema({
    content: String,
    author:{
        type : Schema.Types.ObjectId,
        ref: "User"
    }
},{ 
    timestamps: true
})


const listingSchema = new Schema({
    title: String,
    location: String,
    description:String,
    imageurl: String,
    titleImageUrl: String,
    adder:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments:[commentSchema]

},{
    timestamps: true
})

module.exports = mongoose.model("listing", listingSchema)