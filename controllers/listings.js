// controllers/listings.js
const express = require('express');
const Listing = require('../models/listing');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
    if (req.session.user)
    {
    const listings = await Listing.find({}).populate('owner');
    res.render('listings/index.ejs', {listings: listings,});
    }
    else
    {
      res.redirect('/sign-in');
    }
    } catch (error) {
    console.error(error);
    res.redirect('/');
    }
});

router.get('/new', async (req, res) =>
{
    try {
    res.render('listings/new.ejs');
        
    } catch (error) {
    console.log(error);
    res.redirect('/');
    }
});



router.post('/', async (req, res) => {
req.body.owner = req.session.user._id;
  await Listing.create(req.body);
  res.redirect('/listings');
});

router.get('/:id', async (req, res) => {
    try {
    if (req.session.user)
    {
    const listing = await Listing.findById(req.params.id).populate("owner");
    res.render('listings/show.ejs',{listing});
    }
    else
    {
      res.redirect('/sign-in');
    }
    } catch (error) {
    console.error(error);
    res.redirect('/listings');
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const isOwner = listing.owner.equals(req.session.user._id);
    if (isOwner) {
      await listing.deleteOne();
      res.redirect('/listings');
      console.log('Permission granted');
    } else {
      throw new Error("Permission denied to "+req.session.user.username);
    }

    res.send(`A DELETE request was issued for ${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    if (req.session.user)
    {
    const currentListing = await Listing.findById(req.params.id);
    res.render('listings/edit.ejs', {
      listing: currentListing,
    });
    }
    else
    {
      res.redirect('/sign-in');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.id);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
