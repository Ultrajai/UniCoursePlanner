// modules
const express = require('express');
const app = express();
const path = require('path');
var mongoose = require('mongoose');

//set our port
const port = 3000

//config files
var db = require('./config/db');
mongoose.connect(db.url);

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

//startup our app at http://localhost:3000
app.listen(port, () => console.log('example app listening on port ' + port +  '!'));
