const express = require("express")
const router = express.Router();
const Listing = require("../models/listing")
const isSignedIn = require("../middleware/is-signed-in")
const {cloudinary} = require("../config/cloudinary")
const upload = require("../config/multer")

// get new
router.get("/new", isSignedIn, (req, res) => {
    res.render("listings/new.ejs")
})

//post to db
router.post("/", isSignedIn, upload.single('image') ,async (req, res) => {
    try {
        req.body.adder = req.session.user._id
        req.body.image = {
            url: req.file.path,
            cloudinary_id: req.file.filename
        }
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
        const foundListings = await Listing.findById(req.params.listingId).populate("adder").populate("comments.author")
        res.render("listings/show.ejs", { foundListings: foundListings })
    }
    catch (error) {
        console.log(error)
        res.redirect("/listings/index")
    }
})

//delete
router.delete("/:listingId", isSignedIn, async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate("adder")

        if (foundListing.adder._id.equals(req.session.user._id)) {
            return res.send("Not authorized")
        }
        if (foundListing.imageurl?.cloudinary_id) {
            await cloudinary.uploader.destroy(foundListing.imageurl.cloudinary_id)
        }

        await foundListing.deleteOne()
        return res.redirect("/listings/index")
    }
    catch (error) {
        return res.send("Error the delete")
    }
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

// put the edit in the db
router.put("/:listingId", isSignedIn, upload.single("imageurl"), async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate("adder")

        if (foundListing.adder._id.equals(req.session.user._id)) {
            if (req.file && foundListing.imageurl?.cloudinary_id) {
                await cloudinary.uploader.destroy(foundListing.imageurl.cloudinary_id)
                foundListing.imageurl.url = req.file.path
                foundListing.imageurl.cloudinary_id = req.file.filename
            }

            foundListing.title = req.body.title
            foundListing.location = req.body.location
            foundListing.description = req.body.description
            foundListing.titleImageUrl = req.body.titleImageUrl

            await foundListing.save()
            return res.redirect(`/listings/${req.params.listingId}`)
        }
    }
    catch (error) {
        console.log(error)
        return res.send("Not authrized")
    }
})

// post comments
router.post("/:listingId/comments", isSignedIn, async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId)
        req.body.author = req.session.user._id
        foundListing.comments.push(req.body)
        await foundListing.save()
        res.redirect(`/listings/${req.params.listingId}`)
    }
    catch (error) {
        console.log(error)
        res.send("Sorry fo that")
    }
})

//delete the comment
router.delete("/:listingId/comments/:commentId", isSignedIn, async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId)
        const comment = foundListing.comments.id(req.params.commentId)

        if (comment.author.equals(req.session.user._id)) {
            comment.deleteOne()
            await foundListing.save()
            res.redirect(`/listings/${req.params.listingId}`)
        }

    }
    catch (error) {
        console.log(error)
        res.send("Not authorized")
    }
})

//edit comment

router.put("/:listingId/comments/:commentId", isSignedIn, async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId)
        const comment = foundListing.comments.id(req.params.commentId)

        if (comment.author._id.equals(req.session.user._id)) {
            comment.content = req.body.content
            await foundListing.save()
            res.redirect(`/listings/${req.params.listingId}`)
        }

    }
    catch (error) {
        console.log(error)
        res.send("Not authorized")
    }
})




module.exports = router