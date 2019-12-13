
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
let Title = require("../schema/title");
let Construction = require("../schema/construction");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// title api

  router.post("/add_title", (req, res, next) => {
    const title = new Title({
        name:req.body.name 
    });
    title.save().then(createdTitle => {
        res.status(201).json({
            message: "title added successfully",
            titleId: createdTitle._id
        });
    });
  });



  router.get('/titles_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const titleQuery = Title.find().sort({_id:-1});
    let fetchedTitles;
    if (pageSize && currentPage) {
      titleQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    titleQuery
      .then(documents => {
        fetchedTitles = documents;
        return Title.count();
      })
      .then(async function (count)  {
        var titleNewArray = [];

        for(const title of fetchedTitles) {
          const data = await delayedLog(title);
          titleNewArray.push(data);
        }

        res.status(200).json({
          message: "Title fetched successfully!",
          titles: titleNewArray,
          maxTitles: count
        });
      });
  });


  function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  return new Promise(function(resolve,reject)
  {
    Construction.find({title: arrayData._id })
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



   router.get("/title_delete/:id", (req, res, next) => {
  Title.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Ressort deleted!" });
  });
});


  router.get("/title_detail/:id", (req, res, next) => {
  Title.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Title not found!" });
    }
  });
});


  router.put("/title_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const title = new Title({
    _id: req.body.id,
    name: req.body.name,
  });
  Title.updateOne({ _id: req.params.id }, title).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


 



  

  module.exports = router;