// modules
const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const {exec} = require('child_process');
var mongoose = require('mongoose');

//set our port
const port = 3000

//config files
var db = require('./config/db');
mongoose.connect(db.url);

// update dbs

var courses = [];
var indexCourses = 0;

async function scrapeCourses(url, browser){
  const page = await browser.newPage();
  await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

  console.log('Visiting ' + url);

  var courseList = await page.$$('.course');


  for (var i = 0; i < courseList.length; i++) {

    courses.push({Code: '', Title: '', Availability: '', Credits: '',Description: '', Offerings: '', Prerequisites: '', Restrictions: '', Equates: ''});

    var titles = await courseList[i].$('.title');
    var descriptions = await courseList[i].$('.description');
    var offerings = await courseList[i].$('.offering');
    var restrictions = await courseList[i].$('.restrictions');
    var prereqs = await courseList[i].$('.prereqs');
    var equates = await courseList[i].$('.equates');

    var text = await titles.getProperty('textContent');
    var rawText = await text.jsonValue();
    rawText = rawText.trim();

    courses[indexCourses].Code = rawText.slice(0, rawText.search(/\s/));
    courses[indexCourses].Title = rawText.slice(rawText.search(/\s/), rawText.search(/ [SFWU,]{1,5} /));
    courses[indexCourses].Availability = rawText.slice(rawText.search(/[SFWU,]{1,5} /), rawText.search(/ \([0-9][-][0-9]\) /));
    courses[indexCourses].Credits = rawText.slice(rawText.search(/[0-9][.][0-9][0-9]/), rawText.length - 1);

    text = await descriptions.getProperty('textContent');
    rawText = await text.jsonValue();
    rawText = rawText.trim();

    courses[indexCourses].Description = rawText.split("\n").join("").split(/[ ]{2,}/).join("");

    if(offerings != null){
      text = await offerings.getProperty('textContent');
      rawText = await text.jsonValue();
      rawText = rawText.trim();

      courses[indexCourses].Offerings = rawText.split("\n").join("").split(/[ ]{2,}/).join("").slice(rawText.search(':') + 1, rawText.length);
    }

    if(restrictions != null){
      text = await restrictions.getProperty('textContent');
      rawText = await text.jsonValue();
      rawText = rawText.trim();

      courses[indexCourses].Restrictions = rawText.split("\n").join("").split(/[ ]{2,}/).join("").slice(rawText.search(':') + 1, rawText.length);
    }

    if(prereqs != null){
      text = await prereqs.getProperty('textContent');
      rawText = await text.jsonValue();
      rawText = rawText.trim();

      courses[indexCourses].Prerequisites = rawText.split("\n").join("").split(/[ ]{2,}/).join("").slice(rawText.search(':') + 1, rawText.length);
    }

    if(equates != null){
      text = await equates.getProperty('textContent');
      rawText = await text.jsonValue();
      rawText = rawText.trim();

      courses[indexCourses].Equates = rawText.split("\n").join("").split(/[ ]{2,}/).join("").slice(rawText.search(':') + 1, rawText.length);
    }

    indexCourses += 1;
  }

  //console.log(courses)


}

async function checkIfUpdated(url){
  const browser = await puppeteer.launch({
        headless : true,
        devtools : false
    });
  const page = await browser.newPage();
  await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

  const [el] = await page.$x('//*[@id="content"]/div[1]/h1');
  const version = await el.getProperty('textContent');
  const rawVersion = await version.jsonValue();

  if(db.Version != rawVersion.trim()){
    db.Version = rawVersion.trim();

    fs.writeFile('./config/db.js', "module.exports = {url : 'mongodb://localhost:27017/test', Version: '"+ rawVersion.trim() +"'}", (err) => {if (err) throw err;});

    console.log('Updating database....');
    const page2 = await browser.newPage();
    await page2.goto('https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c12/index.shtml', {timeout: 0, waitUntil: 'networkidle0'});

    var i = 1;
    while (true) {
      const [el2] = await page2.$x('//*[@id="sidebar"]/div/ul[2]/li['+ i +']/a');

      if(el2 == null){
        break;
      }

      const link = await el2.getProperty('href');
      const rawLink = await link.jsonValue();

      await scrapeCourses(rawLink.toString(), browser);
      i += 1;
    }

    var courseListJSON = JSON.stringify(courses);
    fs.writeFile('courses.json', courseListJSON, (err) => {if (err) throw err;});
    exec("mongoimport --jsonArray --db GuelphCareerPlanner --collection Courses --file courses.json", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

  }

  browser.close();

}

checkIfUpdated('https://www.uoguelph.ca/registrar/calendars/undergraduate/current/');

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

//startup our app at http://localhost:3000
app.listen(port, () => console.log('example app listening on port ' + port +  '!'));
