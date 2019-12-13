
const config = require('../database');
const async = require('async');
const crypto = require('crypto');
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const path = require('path');
var md5 = require('md5');


const base_url = '';

/* image downloader */
const download = require('image-downloader');

/** schemas */
let Location = require("../schema/location");
let Construction = require("../schema/construction");





/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// location api

router.get('/location_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const locationQuery = Location.find().sort({_id:-1}).populate('user', 'name');
  let fetchedPosts;
  if (pageSize && currentPage) {
    locationQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  locationQuery
    .then(documents => {
      fetchedLocations = documents;
      return Location.count();
    })
    .then(async function (count)  {

      var locationNewArray = [];

      for(const location of fetchedLocations) {
        const data = await delayedLog(location);
        locationNewArray.push(data);
      }


      res.status(200).json({

       
        message: "Locations fetched successfully!",
        locations: locationNewArray,
        maxLocations: count
      });
    });
});


function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['user'] = arrayData.user;
  array1['site_name'] = arrayData.site_name;
  array1['place'] = arrayData.place;
  return new Promise(function(resolve,reject)
  {
      Construction.find({location: arrayData._id })
            .then(constructionData => {
              if(constructionData.length <= 0) {
                array1['status'] = 0;
                resolve(array1);
              }
              else
              {
                 array1['status'] = 1;
                  resolve(array1);
              }
           })
     
   }); 
}


router.get("/location_detail/:id", (req, res, next) => {
  Location.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Location not found!" });
    }
  });
});




router.post("/add_location", (req, res, next) => {
  const location = new Location({
    user: req.body.user,
    site_name: req.body.site_name,
    place: req.body.place
  });
  location.save().then(createdLocation => {
    res.status(201).json({
      message: "Location added successfully",
      locationId: createdLocation._id
    });
  });
});


router.put("/location_edit/:id", (req, res, next) => {
  const location = new Location({
    _id: req.body.id,
    user: req.body.user,
    site_name: req.body.site_name,
    place: req.body.place
  });
  Location.updateOne({ _id: req.params.id }, location).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


router.get("/locations/:id", (req, res, next) => {
  Location.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Location deleted!" });
  });
});





module.exports = router;
