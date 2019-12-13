
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
let ManageCategory = require("../schema/manageCategory");





/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// manageCategory api

router.get('/manageCategory_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const manageCategoryQuery = ManageCategory.find().sort({_id:-1}).populate('category', 'name').populate('subCategory', 'name');
  let fetchedPosts;
  if (pageSize && currentPage) {
    manageCategoryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  manageCategoryQuery
    .then(documents => {
      console.log(documents);
      fetchedManageCategorys = documents;
      return ManageCategory.count();
    })
    .then(count => {
        res.status(200).json({
          message: "Manage Category fetched successfully!",
          manageCategorys: fetchedManageCategorys,
          maxManageCategorys: count
        });
      });
});



router.get("/manageCategory_detail/:id", (req, res, next) => {
  ManageCategory.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "ManageCategory not found!" });
    }
  });
});




router.post("/add_manageCategory", (req, res, next) => {
  const manageCategory = new ManageCategory({
    category: req.body.category,
    subCategory: req.body.subCategory
  });
  manageCategory.save().then(createdManageCategory => {
    res.status(201).json({
      message: "manageCategory added successfully",
      manageCategoryId: createdManageCategory._id
    });
  });
});


router.put("/manageCategory_edit/:id", (req, res, next) => {
  const manageCategory = new ManageCategory({
    _id: req.body.id,
    category: req.body.category,
    subCategory: req.body.subCategory
  });
  ManageCategory.updateOne({ _id: req.params.id }, manageCategory).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


router.get("/manageCategorys/:id", (req, res, next) => {
  ManageCategory.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Manage Category deleted!" });
  });
});


function getCategoryFunction(category_id)
{
      return new Promise(function(resolve,reject)
      {
          Category.findById(category_id).exec(function (err, results) {
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
