module.exports = {
  HavePrereq : function (semesters, courseToAdd){
    // first version : CIS*1000, CUS*2000
    // second version : 1 of CIS*1000, CIS*3000
    // third version : CIS*1000, (1 of CIS*2000, CIS*3000)
    // forth version :  CIS*1000, (CIS*2000 or CIS*3000)
    // fifth version : CIS*1000, (CIS*2000 and CIS*3000)
    // sixth version : CIS*1000, [CIS*2000 or (CIS...)]
    // seventh version : 4.00 credits including ABC*1000, ABC*2000
    // eighth version : ABC*1000 (ABC*1000 may be taken concurrently)

    var prereqCourses = [];
    var prereqString = courseToAdd.Prerequisites;
    var coursesString = "";

    // regular expression that looks for the course codes only that are listed
    coursesString = prereqString.match(/([A-Za-z][A-Za-z][A-Za-z][*][0-9][0-9][0-9][0-9][,]?)*/);
    return coursesString;
  },
  HaveEquate : function (){
    //something
  },
  TooManyCred : function (){
    //something
  },
  Restricted : function(){
    //something
  }
}
