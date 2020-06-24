// modules
const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
var mongoose = require('mongoose');

//set our port
const port = 3000

//config files
var db = require('./config/db');
mongoose.connect(db.url);

// update dbs

var courses = [];

async function scrapeCourses(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  var j = 2;

  while(true){

    var course = {Code: '', Title: '', Availability: '', Description: '', Offerings: '', Prerequisites: '', Restrictions: ''}
    
    const [el] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr[1]/th');

    if(el == null){
      break;
    }

    const title = await el.getProperty('textContent');
    const rawTitle = await title.jsonValue();

    const [el2] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr[2]/td');
    const desc = await el2.getProperty('textContent');
    const rawDesc = await desc.jsonValue();

    var i = 3;

    while (true) {

      const [el3] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr['+ i +']/th');

      if(el3 == null){
        break;
      }

      const section = await el3.getProperty('textContent');
      const rawSection = await section.jsonValue();

      if(rawSection == 'Offering(s):'){
        const [el4] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr['+ i +']/td');
        const offer = await el4.getProperty('textContent');
        const rawOffer = await offer.jsonValue();

        course.Offerings = rawOffer.trim();

      }
      else if (rawSection == 'Restriction(s):') {
        const [el4] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr['+ i +']/td');
        const restrictions = await el4.getProperty('textContent');
        const rawRestrictions = await restrictions.jsonValue();

        course.Restrictions = rawRestrictions.trim();
      }
      else if(rawSection == 'Prerequisite(s):'){
        const [el4] = await page.$x('//*[@id="content"]/div['+ j +']/table/tbody/tr['+ i +']/td');
        const prereq = await el4.getProperty('textContent');
        const rawPrereq = await prereq.jsonValue();

        course.Prerequisites = rawPrereq.trim();
      }

      i += 1;
    }

    course.Code = rawTitle.slice(0, 8);
    course.Title = rawTitle.slice(9, rawTitle.search(/ [SFWU,]{1,5} /));
    course.Availability = rawTitle.slice(rawTitle.search(/[SFWU,]{1,5} /), rawTitle.search(/ \([0-9][-][0-9]\) /));
    course.Description = rawDesc.trim().split("\n").join("").split(/[ ]{2,}/).join("");

    courses.push(course);


    j += 1;
  }


  console.log(courses)


}

async function checkIfUpdated(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="content"]/div[1]/h1');
  const version = await el.getProperty('textContent');
  const rawVersion = await version.jsonValue();

  if(db.Version != rawVersion){
    db.Version = rawVersion.trim();

    fs.writeFile('./config/db.js', "module.exports = {url : 'mongodb://localhost:27017/test', Version: '"+ rawVersion.trim() +"'}", (err) => {if (err) throw err;});

    console.log('Updating database....');
    //scrapeCourses('https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c12/c12cis.shtml');
  }

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

//startup our app at http://localhost:3000
app.listen(port, () => console.log('example app listening on port ' + port +  '!'));
