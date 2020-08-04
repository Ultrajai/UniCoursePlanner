// modules
const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cdc = require('./cdc');
var cdp = require('./cdp');
//set our port
const port = 3000
app.use(bodyParser.json())

//models
var Course = mongoose.model('Course', {Code : {type: String, default: ''}, Title : {type: String, default: ''}, Availability : {type: String, default: ''}, Credits : {type: String, default: ''}, Offerings : {type: String, default: ''}, Equates : {type: String, default: ''}}, 'Courses');

//config files
var db = require('./config/db');
mongoose.connect(db.url);

// update dbs
var courses = [];
var indexCourses = 0;
cdc.CheckIfUpdated('https://www.uoguelph.ca/registrar/calendars/undergraduate/current/', db);

//front end routes
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/app.js', function(req, res) {
res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/node_modules/angular/angular.min.js', function(req, res) {
res.sendFile(path.join(__dirname + '/node_modules/angular/angular.min.js'));
});

app.get('/node_modules/angular/angular.min.js.map', function(req, res) {
res.sendFile(path.join(__dirname + '/node_modules/angular/angular.min.js.map'));
});

app.get('/node_modules/angular/angular-route.min.js', function(req, res) {
res.sendFile(path.join(__dirname + '/node_modules/angular/angular-route.min.js'));
});

app.get('/node_modules/angular/angular-route.min.js.map', function(req, res) {
res.sendFile(path.join(__dirname + '/node_modules/angular/angular-route.min.js.map'));
});

app.get('/Bootstrap/css/bootstrap.min.css', function(req, res) {
res.sendFile(path.join(__dirname + '/Bootstrap/css/bootstrap.min.css'));
});

app.get('/Bootstrap/css/bootstrap.min.css.map', function(req, res) {
res.sendFile(path.join(__dirname + '/Bootstrap/css/bootstrap.min.css.map'));
});

app.get('/Bootstrap/js/bootstrap.min.js', function(req, res) {
res.sendFile(path.join(__dirname + '/Bootstrap/js/bootstrap.min.js'));
});

app.get('/GetAllCourses', function(req, res) {
  //use mongoose to get all students in the database
    Course.find(function(err, results){
        if(err)
            res.send(err);
        res.send(results); // return all students in JSON format
    });
});

app.post('/CourseValidation', function(req, res){
  console.log(req.body);

  console.log(cdp.HavePrereq(req.body.semesters, req.body.course));

  res.send('Success!!!');
});
//startup our app at http://localhost:3000
app.listen(port, () => console.log('example app listening on port ' + port +  '!'));
