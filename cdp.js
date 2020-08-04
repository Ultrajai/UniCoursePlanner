module.exports = {
  HavePrereq : function (semesters, courseToAddRemove){
    // first version : CIS*1000, CUS*2000
    // second version : 1 of CIS*1000, CIS*3000
    // third version : CIS*1000, (1 of CIS*2000, CIS*3000)
    // forth version :  CIS*1000, (CIS*2000 or CIS*3000)
    // fifth version : CIS*1000, (CIS*2000 and CIS*3000)
    // sixth version : CIS*1000, [CIS*2000 or (CIS...)]
    // seventh version : 4.00 credits including ABC*1000, ABC*2000
    // eighth version : ABC*1000 (ABC*1000 may be taken concurrently)

    // regular expression that looks for the course codes only that are listed
    return courseToAddRemove.Prerequisites.match(/([\(]?((1 of )?[A-Z]{3,5}[*][0-9][0-9][0-9][0-9][,]?[ ]?([a-z]{2,3}[ ])?)+[\)]?)+/g);
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
