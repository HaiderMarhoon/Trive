const express = require("express")
const ruoter = express.Router()
const isSignedIn = require("../middleware/is-signed-in")
const router = require("./auth.controller")
const Listing = require("../models/listing")

router.get("/new",isSignedIn, (req,res)=>{
    res.render("listing/new.ejs")
})
router.post("/" , isSignedIn, async(req,res)=>{
    try{
        req.body.adder = req.session.user._id
        await Listing.create(req.body)
        res.redirect("/listings")
    }
    catch(error){
        console.log(error)
        res.send("Error")
    }
})

module.exports = router