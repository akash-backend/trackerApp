
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
let Investment = require("../schema/investment");
let InvestmentProgram = require("../schema/investmentProgram");
let ConstructionProgram = require("../schema/constructionProgram");




/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// investments api

  router.post("/add_investment", (req, res, next) => {
    const investment = new Investment({
        name:req.body.name,
        total_budget:req.body.total_budget, 
    });
    investment.save().then(createdInvestment => {
        res.status(201).json({
            message: "investments added successfully",
            investmentId: createdInvestment._id
        });
    });
  });



  router.get('/investment_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const investmentQuery = Investment.find().sort({_id:-1});
    let fetchedInvestments;
    if (pageSize && currentPage) {
      investmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    investmentQuery
      .then(documents => {
        fetchedInvestments = documents;
        return Investment.count();
      })
      .then(async function (count)  {
        var investmentNewArray = [];

        for(const investment of fetchedInvestments) {
        const data = await delayedLog(investment);
        investmentNewArray.push(data);
      }

        res.status(200).json({
          message: "Investment fetched successfully!",
          investments: investmentNewArray,
          maxInvestments: count
        });
      });
  });

  router.get("/investment_delete/:id", (req, res, next) => {
  Investment.deleteOne({ _id: req.params.id }).then(result => {
     InvestmentProgram.remove({ investment_program_name: req.params.id }).then(result => {
      res.status(200).json({ message: "Investment deleted!" });
    });
  });
});


  function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['total_budget'] = arrayData.total_budget;
  return new Promise(function(resolve,reject)
  {
  InvestmentProgram.find({investment_program_name: arrayData._id })
  .then(ressortData => {
    if(ressortData.length <= 0) {
      ConstructionProgram.find({programId: arrayData._id })
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


  router.get("/investment_detail/:id", (req, res, next) => {
  Investment.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Investment not found!" });
    }
  });
});


  router.put("/investment_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const investment = new Investment({
    _id: req.body.id,
    name: req.body.name,
    total_budget: req.body.total_budget,
  });

  Investment.updateOne({ _id: req.params.id }, investment).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;