
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
let User = require("../schema/user");
let Location = require("../schema/location");
let Ressort = require("../schema/ressort");
let InvestmentProgram = require("../schema/investmentProgram");
let Construction = require("../schema/construction");




/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// user api

router.get('/user_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find().sort({_id:-1}).populate('ressort', 'name');
  let fetchedPosts;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(async function (count){
      var userNewArray = [];
      for(const user of fetchedUsers) {
        const data = await delayedLog(user);
        userNewArray.push(data);
      }
      res.status(200).json({

       
        message: "Users fetched successfully!",
        users: userNewArray,
        maxUsers: count
      });
    });
});


function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['ressort'] = arrayData.ressort;
  return new Promise(function(resolve,reject)
  {
  Location.find({user: arrayData._id })
  .then(locationData => {
    if(locationData.length <= 0) {
        InvestmentProgram.find({user: arrayData._id })
        .then(investmentData => {
          if(investmentData.length <= 0) {

            Construction.find({user: arrayData._id })
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
      
     
      
    }
    else
    {
      array1['status'] = 1;
      
      resolve(array1);
    }
  })
   }); 
}

router.get("/user_detail/:id", (req, res, next) => {
  User.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});




router.post("/add_user", (req, res, next) => {
  const user = new User({
    name: req.body.name,
    ressort: req.body.ressort
  });
  user.save().then(createdUser => {
    res.status(201).json({
      message: "User added successfully",
      userId: createdUser._id
    });
  });
});


router.put("/user_edit/:id", (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    ressort: req.body.ressort
  });
  User.updateOne({ _id: req.params.id }, user).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


router.get("/users/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "User deleted!" });
  });
});


function getRessortFunction(ressort_id)
{
      return new Promise(function(resolve,reject)
      {
          Ressort.findById(ressort_id).exec(function (err, results) {
          if (!err) {
            if(results.length > 0) 
             {
              resolve(results);
             }
             else
             {
               resolve(results);
             }
          }
          else {
            var results = array();
            resolve(results);
          }
        });
      }); 
}


module.exports = router;
