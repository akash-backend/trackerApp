
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
let SectionPlan = require("../schema/sectionPlan");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// sectionPlans api

  router.post("/add_sectionPlan", (req, res, next) => {
    const sectionPlan = new SectionPlan({
        section:req.body.section,
        year:req.body.year,
        amount:req.body.amount
    });
    sectionPlan.save().then(createdSectionPlan => {
        res.status(201).json({
            message: "sectionPlans added successfully",
            sectionPlanId: createdSectionPlan._id
        });
    });
  });



  router.get('/sectionPlan_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const sectionPlanQuery = SectionPlan.find().sort({_id:-1}).populate('section', 'name');
    let fetchedSectionPlans;
    if (pageSize && currentPage) {
      sectionPlanQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    sectionPlanQuery
      .then(documents => {
        fetchedSectionPlans = documents;
        return SectionPlan.count();
      })
      .then(count => {
        res.status(200).json({
          message: "SectionPlan fetched successfully!",
          sectionPlans: fetchedSectionPlans,
          maxSectionPlans: count
        });
      });
  });

  router.get("/sectionPlan_delete/:id", (req, res, next) => {
  SectionPlan.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Ressort deleted!" });
  });
});


  router.get("/sectionPlan_detail/:id", (req, res, next) => {
  SectionPlan.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "SectionPlan not found!" });
    }
  });
});


  router.put("/sectionPlan_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const sectionPlan = new SectionPlan({
    _id: req.body.id,
    section:req.body.section,
    year:req.body.year,
    amount:req.body.amount
  });
  SectionPlan.updateOne({ _id: req.params.id }, sectionPlan).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;