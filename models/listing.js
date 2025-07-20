const mongoose = require("mongoose")
const Schema = mongoose.Schema


const listingSchema = new Schema({
    title: String,
    location: String,
    description:String,
    imageurl: String,
    titleImageUrl: String,
    adder:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("listing", listingSchema)