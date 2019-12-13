
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
let SubCategory = require("../schema/subCategory");
let Category = require("../schema/category");
let ManageCategory = require("../schema/manageCategory");




/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// subCategory api

router.get('/subCategory_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const subCategoryQuery = SubCategory.find().sort({_id:-1}).populate('category', 'name');
  let fetchedPosts;
  if (pageSize && currentPage) {
    subCategoryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  subCategoryQuery
    .then(documents => {
      fetchedSubCategorys = documents;
      return SubCategory.count();
    })
    .then(async function (count){
      var subCategoryNewArray = [];
      for(const subCategory of fetchedSubCategorys) {
        const data = await delayedLog(subCategory);
        subCategoryNewArray.push(data);
      }
      res.status(200).json({

       
        message: "SubCategorys fetched successfully!",
        subCategorys: subCategoryNewArray,
        maxSubCategorys: count
      });
    });
});



router.get('/get_subCategory_by_categoryId/:id', (req, res, next) => {
  const subCategoryQuery = SubCategory.find({category:req.params.id}).sort({_id:-1});
  subCategoryQuery
    .then(documents => {
      fetchedSubCategorys = documents;

      res.status(200).json({       
      message: "SubCategorys fetched successfully!",
      subCategorys: fetchedSubCategorys,
    });   
  });
});


function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['category'] = arrayData.category;
  return new Promise(function(resolve,reject)
  {
  ManageCategory.find({subCategory: arrayData._id })
  .then(manageCategoryData => {
    if(manageCategoryData.length <= 0) {
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

router.get("/subCategory_detail/:id", (req, res, next) => {
  SubCategory.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "SubCategory not found!" });
    }
  });
});




router.post("/add_subCategory", (req, res, next) => {
  const subCategory = new SubCategory({
    name: req.body.name,
    category: req.body.category
  });
  subCategory.save().then(createdSubCategory => {
    res.status(201).json({
      message: "subCategory added successfully",
      subCategoryId: createdSubCategory._id
    });
  });
});


router.put("/subCategory_edit/:id", (req, res, next) => {
  const subCategory = new SubCategory({
    _id: req.body.id,
    name: req.body.name,
    category: req.body.category
  });
  SubCategory.updateOne({ _id: req.params.id }, subCategory).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


router.get("/subCategorys/:id", (req, res, next) => {
  SubCategory.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "SubCategory deleted!" });
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
