

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
let Category = require("../schema/category");
let SubCategory = require("../schema/subCategory");
let ManageCategory = require("../schema/manageCategory");






/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// category api

router.get('/category_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  

  const categoryQuery = Category.find().sort({_id:-1});
  let fetchedCategorys;
  if (pageSize && currentPage) {
    categoryQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  categoryQuery
    .then(documents => {
      fetchedCategorys = documents;
      return Category.count();
    })
    .then(async function (count)  {
      var categoryNewArray = [];
      
      for(const category of fetchedCategorys) {
        const data = await delayedLog(category);
        categoryNewArray.push(data);
      }
      res.status(200).json({
        message: "Category fetched successfully!",
        categorys: categoryNewArray,
        maxCategorys: count
      });
    });
});



function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  return new Promise(function(resolve,reject)
  {
  SubCategory.find({category: arrayData._id })
  .then(categoryData => {
    if(categoryData.length <= 0) {

      ManageCategory.find({category: arrayData._id })
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
    }
    else
    {
      array1['status'] = 1;
      
      resolve(array1);
    }
  })
   }); 
}


router.post("/add_category", (req, res, next) => {
  const category = new Category({
    name: req.body.name,
  });
  category.save().then(createdCategory => {
    res.status(201).json({
      message: "Category added successfully",
      categoryId: createdCategory._id
    });
  });
});






router.get("/category_delete/:id", (req, res, next) => {
  Category.deleteOne({ _id: req.params.id }).then(result => {
    SubCategory.remove({ category: req.params.id }).then(result => {
      res.status(200).json({ message: "Category deleted!" });
    });
  });
});

router.get("/category_detail/:id", (req, res, next) => {
  Category.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Category not found!" });
    }
  });
});

router.put("/category_edit/:id", (req, res, next) => {
  const category = new Category({
    _id: req.body.id,
    name: req.body.name,
  });
  Category.updateOne({ _id: req.params.id }, category).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});


module.exports = router;
