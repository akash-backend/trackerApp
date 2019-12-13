
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
let Product = require("../schema/product");
let Construction = require("../schema/construction");



/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// products api

  router.post("/add_product", (req, res, next) => {
    const product = new Product({
        name:req.body.name,
        product_number:req.body.product_number, 
    });
    product.save().then(createdProduct => {
        res.status(201).json({
            message: "products added successfully",
            productId: createdProduct._id
        });
    });
  });



  router.get('/product_list', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
  
    console.log(pageSize);
  
    const productQuery = Product.find().sort({_id:-1});
    let fetchedProducts;
    if (pageSize && currentPage) {
      productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    productQuery
      .then(documents => {
        fetchedProducts = documents;
        return Product.count();
      })
      .then(async function (count)  {

        var productNewArray = [];

        for(const product of fetchedProducts) {
          const data = await delayedLog(product);
          productNewArray.push(data);
        }

        res.status(200).json({
          message: "Product fetched successfully!",
          products: productNewArray,
          maxProducts: count
        });
      });
  });


  function delayedLog(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['product_number'] = arrayData.product_number;
  return new Promise(function(resolve,reject)
  {
      Construction.find({product: arrayData._id })
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
     
   }); 
  }

  router.get("/product_delete/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id }).then(result => {
     res.status(200).json({ message: "Ressort deleted!" });
  });
});


  router.get("/Product_detail/:id", (req, res, next) => {
  Product.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Product not found!" });
    }
  });
});


  router.put("/product_edit/:id", (req, res, next) => {
    console.log(req.body);
    console.log(req.params.id);
  const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    product_number: req.body.product_number,
  });
  Product.updateOne({ _id: req.params.id }, product).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});



  

  module.exports = router;