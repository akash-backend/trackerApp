

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



/** schemas */
let Ressort = require("../schema/ressort");
let User = require("../schema/user");
let Construction = require("../schema/construction");






/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// ressort api

router.get('/ressort_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  

  const ressortQuery = Ressort.find().sort({_id:-1});
  let fetchedRessorts;
  if (pageSize && currentPage) {
    ressortQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  ressortQuery
    .then(documents => {
      fetchedRessorts = documents;
      return Ressort.count();
    })
    .then(async function (count)  {
      var ressortNewArray = [];
      
      for(const ressort of fetchedRessorts) {
        const data = await delayedLog(ressort);
        ressortNewArray.push(data);
      }
      res.status(200).json({
        message: "Ressort fetched successfully!",
        ressorts: ressortNewArray,
        maxRessorts: count
      });
    });
});



function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  return new Promise(function(resolve,reject)
  {
  User.find({ressort: arrayData._id })
  .then(ressortData => {
    if(ressortData.length <= 0) {
      Construction.find({ressort: arrayData._id })
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
     
    }
    else
    {
      array1['status'] = 1;
      
      resolve(array1);
    }
  })
   }); 
}


router.post("/add_ressort", (req, res, next) => {
  const ressort = new Ressort({
    name: req.body.name,
  });
  ressort.save().then(createdRessort => {
    res.status(201).json({
      message: "Ressort added successfully",
      ressortId: createdRessort._id
    });
  });
});






router.get("/ressort_delete/:id", (req, res, next) => {
  Ressort.deleteOne({ _id: req.params.id }).then(result => {
    User.remove({ ressort: req.params.id }).then(result => {
      res.status(200).json({ message: "Ressort deleted!" });
    });
  });
});

router.get("/ressort_detail/:id", (req, res, next) => {
  Ressort.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "rRessort not found!" });
    }
  });
});

router.put("/ressort_edit/:id", (req, res, next) => {
  const ressort = new Ressort({
    _id: req.body.id,
    name: req.body.name,
  });
  Ressort.updateOne({ _id: req.params.id }, ressort).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


module.exports = router;
