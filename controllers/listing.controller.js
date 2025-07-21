const express = require("express")
const ruoter = express.Router()
const isSignedIn = require("../middleware/is-signed-in")
const router = require("./auth.controller")
const Listing = require("../models/listing")

// get new
router.get("/new", isSignedIn, (req, res) => {
    res.render("listings/new.ejs")
})

//post to db
router.post("/", isSignedIn, async (req, res) => {
    try {
        req.body.adder = req.session.user._id
        await Listing.create(req.body)
        res.redirect("/listings/index")
    }
    catch (error) {
        console.log(error)
        res.send("Error")
    }
})

//index of trip
router.get("/index", async (req, res) => {
    try {
        const foundListing = await Listing.find()
        console.log(foundListing)
        res.render("listings/index.ejs", { foundListing: foundListing })

    }
    catch (erro) {
        console.log(error)
        res.send("Error")
    }
})

//show
router.get("/:listingId", async (req, res) => {
    try {
        const foundListings = await Listing.findById(req.params.listingId).populate("adder")
        res.render("listings/show.ejs", { foundListings: foundListings })
    }
    catch (error) {
        console.log(error)
        res.redirect("/listings/index")
    }
})

//delete
router.delete("/:listingId", isSignedIn, async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate("adder")

    if (foundListing.adder._id.equals(req.session.user._id)) {
        await foundListing.deleteOne()
        return res.redirect("/listings/index")
    }

    return res.send("Not authorized")
})

//edit
router.get("/:listingId/edit", isSignedIn, async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate("adder")
        if (foundListing.adder._id.equals(req.session.user._id)) {
            res.render("listings/edit.ejs", { foundListing: foundListing })
        }
    }
    catch (error) {
        console.log(error)
        return res.send("Not authorized")
    }
})

router.put("/:listingId", isSignedIn , async(req,res)=>{
    try{
        const foundListing = await Listing.findById(req.params.listingId).populate("adder")

        if(foundListing.adder._id.equals(req.session.user._id)){
            await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new:true})
            return res.redirect(`/listings/${req.params.listingId}`)
        }
    }
    catch(error){
        console.log(error)
        return res.send("Not authrized")
    }
})




module.exports = router