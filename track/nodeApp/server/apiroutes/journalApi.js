
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
let Journal = require("../schema/journal");
let Location = require("../schema/location");
let Ressort = require("../schema/ressort");
let InvestmentProgram = require("../schema/investmentProgram");
let Construction = require("../schema/construction");




/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// journal api

router.get('/journal_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const journalQuery = Journal.find().sort({_id:-1}).populate('construction', 'name').populate('plan', 'name').populate('category', 'name').populate('subCategory', 'name');
  let fetchedPosts;
  if (pageSize && currentPage) {
    journalQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  journalQuery
    .then(documents => {
      fetchedJournals = documents;
      return Journal.count();
    })
    .then(function (count){
      // var journalNewArray = [];
      // for(const journal of fetchedJournals) {
      //   const data = await delayedLog(journal);
      //   journalNewArray.push(data);
      // }
      res.status(200).json({

       
        message: "Journals fetched successfully!",
        journals: fetchedJournals,
        maxJournals: count
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
  Location.find({journal: arrayData._id })
  .then(locationData => {
    if(locationData.length <= 0) {
        InvestmentProgram.find({journal: arrayData._id })
        .then(investmentData => {
          if(investmentData.length <= 0) {

            Construction.find({journal: arrayData._id })
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

router.get("/journal_detail/:id", (req, res, next) => {
  Journal.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "journal not found!" });
    }
  });
});




router.post("/add_journal", (req, res, next) => {
  const journal = new Journal({
    construction: req.body.construction,
    explanation: req.body.explanation,
    journaldDate: req.body.journaldDate,
    plan: req.body.plan,
    category: req.body.category,
    subCategory: req.body.subCategory,
    amount: req.body.amount,
    actualCost: req.body.actualCost,
    totlaAmount: req.body.totlaAmount,
    amountType: req.body.amountType,
    lastChange: req.body.lastChange,
  });
  journal.save().then(createdJournal => {
    res.status(201).json({
      message: "Journal added successfully",
      journalId: createdJournal._id
    });
  });
});


router.put("/journal_edit/:id", (req, res, next) => {
  const journal = new Journal({
    _id: req.body.id,
    construction: req.body.construction,
    explanation: req.body.explanation,
    journaldDate: req.body.journaldDate,
    plan: req.body.plan,
    category: req.body.category,
    subCategory: req.body.subCategory,
    amount: req.body.amount,
    actualCost: req.body.actualCost,
    totlaAmount: req.body.totlaAmount,
    amountType: req.body.amountType,
    lastChange: req.body.lastChange,
  });
  Journal.updateOne({ _id: req.params.id }, journal).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


router.get("/journals/:id", (req, res, next) => {
  Journal.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Journal deleted!" });
  });
});





module.exports = router;
