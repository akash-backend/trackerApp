

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
let Construction = require("../schema/construction");
let ConstructionFeed = require("../schema/constructionFeed");
let ConstructionProgram = require("../schema/constructionProgram");

var ObjectID = require('mongodb').ObjectID;







/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


// construction api

router.get('/construction_list', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  

  const constructionQuery = Construction.find().sort({_id:-1});
  let fetchedConstructions;
  if (pageSize && currentPage) {
    constructionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  constructionQuery
    .then(documents => {
      fetchedConstructions = documents;
      return Construction.count();
    })
     .then(async function (count){

      var constructionNewArray = [];
      for(const construction of fetchedConstructions) {
        const data = await delayedLogCheckExist(construction);
        constructionNewArray.push(data);
      }

      res.status(200).json({
        message: "Construction fetched successfully!",
        constructions: constructionNewArray,
        maxConstructions: count
      });
    });
});


function delayedLogCheckExist(arrayData) {
  var array1 = {};
  array1['_id'] = arrayData._id;
  array1['name'] = arrayData.name;
  array1['street'] = arrayData.street;
  array1['azHMdFDeptIV'] = arrayData.azHMdFDeptIV;
  array1['projectNrPartner'] = arrayData.projectNrPartner;
  array1['device'] = arrayData.device;
  array1['recordingDate'] = arrayData.recordingDate;
  array1['user'] = arrayData.user;
  array1['location'] = arrayData.location;
  array1['ressort'] = arrayData.ressort;
  array1['ActionCoordinator'] = arrayData.ActionCoordinator;
  array1['section'] = arrayData.section;
  array1['product'] = arrayData.product;
  array1['interiorRef'] = arrayData.interiorRef;
  array1['title'] = arrayData.title;
  array1['referenceToConstructionMeasure'] = arrayData.referenceToConstructionMeasure;
  array1['relevantForMFP'] = arrayData.relevantForMFP;
  array1['constructionName'] = arrayData.constructionName;


  return new Promise(function(resolve,reject)
  {

  Construction.find({$and:[{"constructionName":arrayData._id},{"device": true}]})
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


router.get('/construction_list_by_id/:id', (req, res, next) => {
  _id = new ObjectID(req.params.id);

  

  const constructionQuery = Construction.find({_id: {$ne: _id }}).sort({_id:-1});
  
  constructionQuery
    .then(documents => {
      fetchedConstructions = documents;
      return Construction.count();
    })
     .then(count => {
      res.status(200).json({
        message: "Construction fetched successfully!",
        constructions: fetchedConstructions,
        maxConstructions: count
      });
    });
});




router.post("/add_construction", (req, res, next) => {
  const construction = new Construction({
    name: req.body.name,
    street: req.body.street,
    azHMdFDeptIV: req.body.azHMdFDeptIV,
    projectNrPartner: req.body.projectNrPartner,
    device: req.body.device,
    recordingDate: req.body.recordingDate,
    user: req.body.user,
    location: req.body.location,
    ressort: req.body.ressort,
    ActionCoordinator: req.body.ActionCoordinator,
    section: req.body.section,
    product: req.body.product,
    interiorRef: req.body.interiorRef,
    title: req.body.title,
    referenceToConstructionMeasure: req.body.referenceToConstructionMeasure,
    relevantForMFP: req.body.relevantForMFP,
    constructionName: req.body.constructionName,

  });

  construction.save()
  .then(async function (createdConstruction){
  	console.log("stater programme");
      console.log(req.body.programme);
      console.log("end programme");

      console.log("stater programme");
      console.log(req.body.feed);
      console.log("end programme");

  	var arr = req.body.feed;
  	console.log(arr);
  	for(const feedData of arr) {
  		console.log(feedData._id,createdConstruction._id);
  		const data = await delayedLogFeed(feedData._id,createdConstruction._id);
      }


      var arrProgram = req.body.programme;
      console.log(arrProgram);
      for(const programData of arrProgram) {
  		console.log(programData._id,createdConstruction._id);
  		const data = await delayedLogProgram(programData._id,createdConstruction._id);
      }


      console.log("after add");

    res.status(201).json({
      message: "Construction added successfully",
      constructionId: createdConstruction._id
    });
  });
});



router.put("/construction_edit/:id", (req, res, next) => {
  console.log(req.params.id);
  const construction = new Construction({
     _id: req.body.id,
    name: req.body.name,
    street: req.body.street,
    azHMdFDeptIV: req.body.azHMdFDeptIV,
    projectNrPartner: req.body.projectNrPartner,
    device: req.body.device,
    recordingDate: req.body.recordingDate,
    user: req.body.user,
    location: req.body.location,
    ressort: req.body.ressort,
    section: req.body.section,
    ActionCoordinator: req.body.ActionCoordinator,
    section: req.body.section,
    product: req.body.product,
    interiorRef: req.body.interiorRef,
    title: req.body.title,
    referenceToConstructionMeasure: req.body.referenceToConstructionMeasure,
    relevantForMFP: req.body.relevantForMFP,
    constructionName: req.body.constructionName,
  });
  Construction.updateOne({ _id: req.params.id }, construction)
  .then(async function (result)  {

    const dataFeedDelete = await delayedFeedDelete(req.params.id);
    const dataProgramDelete = await delayedProgramDelete(req.params.id);

    var arr = req.body.feed;
    console.log(arr);
    for(const feedData of arr) {
      console.log(feedData._id,req.params.id);
      const data = await delayedLogFeed(feedData._id,req.params.id);
      }


      var arrProgram = req.body.programme;
      console.log(arrProgram);
      for(const programData of arrProgram) {
      console.log(programData._id,req.params.id);
      const data = await delayedLogProgram(programData._id,req.params.id);
      }


      console.log("after add");

    res.status(200).json({ message: "Update successful!" });
  });
});

function delayedLogFeed(feedId, constructionId) {

  return new Promise(function(resolve,reject)
  {
	const constructionFeed = new ConstructionFeed({
	    feedId: feedId,
	    constructionId: constructionId
	});
  	
  	constructionFeed.save().then(createdConstructionFeed => {
  		console.log("delayedLogFeed");
  		resolve();
  	});
  });
}

function delayedLogProgram(programId, constructionId) {

  return new Promise(function(resolve,reject)
  {
	const constructionProgram = new ConstructionProgram({
	    programId: programId,
	    constructionId: constructionId
	});
  	
  	constructionProgram.save().then(createdConstructionProgram => {
  		console.log("delayedLogProgram");
  		resolve();
  	});
  });
}


function delayedFeedDelete(construction_id) {

  return new Promise(function(resolve,reject)
  {
    ConstructionFeed.deleteMany({ constructionId: construction_id }).then(result => { 
      resolve();
      });
  });
}

function delayedProgramDelete(construction_id) {

  return new Promise(function(resolve,reject)
  {
    ConstructionProgram.deleteMany({ constructionId: construction_id }).then(result => { 
      resolve();
      });
  });
}


function delayedLogFeed(feedId, constructionId) {

  return new Promise(function(resolve,reject)
  {
	const constructionFeed = new ConstructionFeed({
	    feedId: feedId,
	    constructionId: constructionId
	});
  	
  	constructionFeed.save().then(createdConstructionFeed => {
  		resolve();
  	});
  });
}






router.get("/construction_delete/:id", (req, res, next) => {
  Construction.deleteOne({ _id: req.params.id }).then(result => {
    ConstructionProgram.deleteMany({ constructionId: req.params.id }).then(result => { 
      ConstructionFeed.deleteMany({ constructionId: req.params.id }).then(result => { 
          res.status(200).json({ message: "Construction deleted!" });
      });
      
      });
      
  });
});

router.get("/construction_detail/:id", (req, res, next) => {
  Construction.findById(req.params.id).then(async function (post) {

    var feed = await delayedLogFeedDetail(req.params.id);
    var program = await delayedLogProgramDetail(req.params.id);


    if (post) {
      res.status(200).json({
        message: "Construction detail fetch successfully",
        construction_list: post,
        feed_list: feed,
        program_list: program,
      });
    } else {
      res.status(404).json({ message: "Construction not found!" });
    }
  });
});


router.get("/construction_view_detail/:id", (req, res, next) => {
  Construction.findById(req.params.id)
  .populate('user', 'name')
  .populate('location', 'site_name')
  .populate('ressort', 'name')
  .populate('section', 'name')
  .populate('product', 'name')
  .populate('title', 'name')
  .populate('constructionName', 'name')
  .then(async function (post) {

    var feed = await delayedLogFeedDetail(req.params.id);
    var program = await delayedLogProgramDetail(req.params.id);

    var feedData="";
    for(const feedValue of feed) {
      console.log(feedValue.donor);
         feedData = feedData+feedValue.donor+",";
      }


  var programData="";
    for(const programValue of program) {
         programData = programData+programValue.name+",";
      }

      
    if (post) {
      res.status(200).json({
        message: "Construction detail fetch successfully",
        construction_list: post,
        feed_list: feedData.slice(0, -1),
        program_list: programData.slice(0, -1),
      });
    } else {
      res.status(404).json({ message: "Construction not found!" });
    }
  });
});

function delayedLogFeedDetail(constructionId) {
  return new Promise(function(resolve,reject)
  {
  ConstructionFeed.find({constructionId: constructionId}).populate({ path: 'feedId', select: '_id donor' })
  .then(constructionFeedData => {
  	
    if(constructionFeedData.length > 0) {
      var feedNewArray = [];
      
      for(const feedValue of constructionFeedData) {
        feedNewArray.push(feedValue.feedId);
      }
     	resolve(feedNewArray);
    }
    else
    {
      var array = {};
      resolve(array);
    }
  })
   }); 
}


function delayedLogProgramDetail(constructionId) {
  return new Promise(function(resolve,reject)
  {
  ConstructionProgram.find({constructionId: constructionId}).populate({ path: 'programId', select: '_id name' })
  .then(constructionProgramData => {
    
    if(constructionProgramData.length > 0) {
      var programNewArray = [];
      
      for(const programValue of constructionProgramData) {
        programNewArray.push(programValue.programId);
      }

      resolve(programNewArray);
    }
    else
    {
      var array = {};
      resolve(array);
    }
  })
   }); 
}




module.exports = router;
