
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
let Feed = require("../schema/feed");
let ConstructionFeed = require("../schema/constructionFeed");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// feeds api

  router.post("/add_feed", (req, res, next) => {
    const feed = new Feed({
        donor:req.body.donor 
    });
    feed.save().then(createdFeed => {
        res.status(201).json({
            message: "feeds added successfully",
            feedId: createdFeed._id
        });
    });
  });



  router.get('/feed_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const feedQuery = Feed.find().sort({_id:-1});
    let fetchedFeeds;
    if (pageSize && currentPage) {
      feedQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    feedQuery
      .then(documents => {
        fetchedFeeds = documents;
        return Feed.count();
      })
      .then(async function (count)  {

        var feedNewArray = [];

        for(const feed of fetchedFeeds) {
          const data = await delayedLog(feed);
          feedNewArray.push(data);
        }


        res.status(200).json({
          message: "Feed fetched successfully!",
          feeds: feedNewArray,
          maxFeeds: count
        });
      });
  });


  function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['donor'] = arrayData.donor;
  return new Promise(function(resolve,reject)
  {
    ConstructionFeed.find({feedId: arrayData._id })
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

  router.get("/feed_delete/:id", (req, res, next) => {
  Feed.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Ressort deleted!" });
  });
});


  router.get("/feed_detail/:id", (req, res, next) => {
  Feed.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Feed not found!" });
    }
  });
});


  router.put("/feed_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const feed = new Feed({
    _id: req.body.id,
    donor: req.body.donor,
  });
  Feed.updateOne({ _id: req.params.id }, feed).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;