
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
let InvestmentProgram = require("../schema/investmentProgram");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// investmentPrograms api

  router.post("/add_investmentProgram", (req, res, next) => {
    const investmentProgram = new InvestmentProgram({
        investment_program_name:req.body.investment_program_name,
        user:req.body.user,
        amount:req.body.amount, 
    });
    investmentProgram.save().then(createdInvestmentProgram => {
        res.status(201).json({
            message: "investmentPrograms added successfully",
            investmentProgramId: createdInvestmentProgram._id
        });
    });
  });



  router.get('/investmentProgram_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const investmentProgramQuery = InvestmentProgram.find().sort({_id:-1}).populate('user', 'name').populate('investment_program_name', 'name');
    let fetchedInvestmentPrograms;
    if (pageSize && currentPage) {
      investmentProgramQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    investmentProgramQuery
      .then(documents => {
        fetchedInvestmentPrograms = documents;
        return InvestmentProgram.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Investment Program fetched successfully!",
          investmentPrograms: fetchedInvestmentPrograms,
          maxInvestmentPrograms: count
        });
      });
  });

  router.get("/investmentProgram_delete/:id", (req, res, next) => {
  InvestmentProgram.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Investment Program deleted!" });
  });
});


  router.get("/investmentProgram_detail/:id", (req, res, next) => {
  InvestmentProgram.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Investment Program not found!" });
    }
  });
});


  router.put("/investmentProgram_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const investmentProgram = new InvestmentProgram({
    _id: req.body.id,
     investment_program_name:req.body.investment_program_name,
     user:req.body.user,
     amount:req.body.amount
  });

  InvestmentProgram.updateOne({ _id: req.params.id }, investmentProgram).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;