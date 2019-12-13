
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
let Plan = require("../schema/plan");

let SectionPlan = require("../schema/sectionPlan");
let Construction = require("../schema/construction");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// plans api

  router.post("/add_plan", (req, res, next) => {
    const plan = new Plan({
        name:req.body.name,
        section:req.body.section, 
    });
    plan.save().then(createdPlan => {
        res.status(201).json({
            message: "plans added successfully",
            planId: createdPlan._id
        });
    });
  });



  router.get('/plan_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const planQuery = Plan.find().sort({_id:-1});
    let fetchedPlans;
    if (pageSize && currentPage) {
      planQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    planQuery
      .then(documents => {
        fetchedPlans = documents;
        return Plan.count();
      })
      .then(async function (count)  {
         var planNewArray = [];

        for(const plan of fetchedPlans) {
        const data = await delayedLog(plan);
        planNewArray.push(data);
      }
        res.status(200).json({
          message: "Plan fetched successfully!",
          plans: planNewArray,
          maxPlans: count
        });
      });
  });

  router.get("/plan_delete/:id", (req, res, next) => {
  Plan.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Ressort deleted!" });
  });
});


    function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['section'] = arrayData.section;
  return new Promise(function(resolve,reject)
  {
  SectionPlan.find({section: arrayData._id })
  .then(ressortData => {
    if(ressortData.length <= 0) {
      Construction.find({section: arrayData._id })
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



  router.get("/plan_detail/:id", (req, res, next) => {
  Plan.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Plan not found!" });
    }
  });
});


  router.put("/plan_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const plan = new Plan({
    _id: req.body.id,
    name: req.body.name,
    section: req.body.section,
  });
  Plan.updateOne({ _id: req.params.id }, plan).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;