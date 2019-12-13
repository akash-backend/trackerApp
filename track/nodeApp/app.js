var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
http = require('http'),
multer = require('multer'),
passport = require('passport'),
mongoose = require('mongoose'),
config = require('./server/database');

var api = require('./server/apiroutes/api');
var userApi = require('./server/apiroutes/userApi');
var ressortApi = require('./server/apiroutes/ressortApi');
var feedApi = require('./server/apiroutes/feedApi');
var titleApi = require('./server/apiroutes/titleApi');
var productApi = require('./server/apiroutes/productApi');
var investmentApi = require('./server/apiroutes/investmentApi');
var locationApi = require('./server/apiroutes/locationApi');
var investmentProgramApi = require('./server/apiroutes/investmentProgramApi');
var planApi = require('./server/apiroutes/planApi');
var sectionPlanApi = require('./server/apiroutes/sectionPlanApi');
var categoryApi = require('./server/apiroutes/categoryApi');
var subCategoryApi = require('./server/apiroutes/subCategoryApi');
var manageCategoryApi = require('./server/apiroutes/manageCategoryApi');
var constructionApi = require('./server/apiroutes/constructionApi');
var journalApi = require('./server/apiroutes/journalApi');
var logger = require('morgan');


global.__basedir = __dirname;
global.globalString = "/upload/";


const app = express();
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.use(cors());
app.use(passport.initialize()); 
app.use(logger('dev')); /* View logs */
app.use(passport.session());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use('/api', api);
app.use('/userApi', userApi);
app.use('/ressortApi', ressortApi);
app.use('/feedApi', feedApi);
app.use('/titleApi',titleApi);
app.use('/productApi',productApi);
app.use('/investmentApi',investmentApi);
app.use('/locationApi',locationApi);
app.use('/investmentProgramApi',investmentProgramApi);
app.use('/planApi',planApi);
app.use('/sectionPlanApi',sectionPlanApi);
app.use('/categoryApi',categoryApi);
app.use('/subCategoryApi',subCategoryApi);
app.use('/manageCategoryApi',manageCategoryApi);
app.use('/constructionApi',constructionApi);
app.use('/journalApi',journalApi);

app.use('/gallery', express.static(__dirname + '/upload/salon'));



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
  );


// error handler
app.use(function (err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
res.status(err.status || 500);
res.render('error');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));