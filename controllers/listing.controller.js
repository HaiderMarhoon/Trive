const express = require("express")
const router = express.Router();
const Listing = require("../models/listing")
const User = require("../models/user")
const isSignedIn = require("../middleware/is-signed-in")
const { cloudinary } = require("../config/cloudinary")
const upload = require("../config/multer")

// get new
router.get("/new", isSignedIn, (req, res) => {
    res.render("listings/new.ejs")
})

//post to db
router.post("/", isSignedIn, upload.array('image', 10), async (req, res) => {
    try {
        const imageTitles = req.body.imageTitles;
        const files = req.files;

        const image = files.map((file, index) => ({
            url: file.path,
            cloudinary_id: file.filename,
            title: Array.isArray(imageTitles) ? imageTitles[index] : imageTitles
        }));

        const listing = new Listing({
            title: req.body.title,
            location: req.body.location,
            description: req.body.description,
            image: image,
            adder: req.session.user._id
        });

        await listing.save();
        res.redirect("/listings/index");
    } catch (error) {
        console.error(error);
        res.send("Upload Error");
    }
});

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

router.get("/favorite", isSignedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('favorites');
        res.render("listings/favorite.ejs", { foundListing: user.favorites });
    } catch (error) {
        console.log(error);
        res.redirect('/listings/index');
    }
});
// Favorite a listing
router.post("/:listingId/favorite", isSignedIn, async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const user = await User.findById(req.session.user._id);
        
        if (!user) {
            res.send('error', 'User not found');
            return res.redirect('back');
        }

        if (!user.favorites.includes(listingId)) {
            user.favorites.push(listingId);
            await user.save();
            res.send('success', 'Added to favorites!');
        } else {
            res.send( 'This listing is already in your favorites');
        }
        
        return res.redirect(`/listings/index`);
    } catch (e) {
        console.error('Favorite error:', e);
        res.send('error', 'Failed to favorite listing');
        return res.redirect('back');
    }
});

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

        if (!foundListing.adder._id.equals(req.session.user._id)) {
            return res.send("Not authorized")
        }
        
        // Delete all images from Cloudinary
        for (const img of foundListing.image) {
            if (img.cloudinary_id) {
                await cloudinary.uploader.destroy(img.cloudinary_id)
            }
        }

        await foundListing.deleteOne()
        return res.redirect("/listings/index")
    }
    catch (error) {
        console.error(error)
        return res.send("Error during deletion")
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
router.put("/:listingId", isSignedIn, upload.array("image", 10), async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate("adder");

        if (!foundListing.adder._id.equals(req.session.user._id)) {
            return res.send("Not authorized");
        }

        // Update simple fields
        foundListing.title = req.body.title;
        foundListing.location = req.body.location;
        foundListing.description = req.body.description;

        // Delete selected images if any
        if (req.body.deleteImages) {
            const idsToDelete = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
            foundListing.image = foundListing.image.filter(img => {
                if (idsToDelete.includes(img.cloudinary_id)) {
                    return false;
                }
                return true;
            });
        }

        // Update titles for existing images
        if (req.body.existingImageTitles) {
            const titles = Array.isArray(req.body.existingImageTitles)
                ? req.body.existingImageTitles
                : [req.body.existingImageTitles];

            foundListing.image.forEach((img, i) => {
                if (titles[i]) {
                    img.title = titles[i];
                }
            });
        }

        // Add newly uploaded images
        if (req.files && req.files.length > 0) {
            const title = req.body.imageTitles || [];
            const newImages = req.files.map((file, index) => ({
                url: file.path,
                cloudinary_id: file.filename,
                title: Array.isArray(title) ? title[index] || "Untitled" : title || "Untitled"
            }));

            foundListing.image.push(...newImages);
        }

        await foundListing.save();
        return res.redirect(`/listings/${req.params.listingId}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
});



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