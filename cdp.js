module.exports = {
  HavePrereq : function (semesters, courseToAddRemove, selectedSemester, addingCourse){

    // first version : CIS*1000, CUS*2000
    // second version : 1 of CIS*1000, CIS*3000
    // third version : CIS*1000, (1 of CIS*2000, CIS*3000)
    // forth version :  CIS*1000, (CIS*2000 or CIS*3000)
    // fifth version : CIS*1000, (CIS*2000 and CIS*3000)
    // sixth version : CIS*1000, [CIS*2000 or (CIS...)]
    // seventh version : 4.00 credits including ABC*1000, ABC*2000
    // eighth version : ABC*1000 (ABC*1000 may be taken concurrently)

    /*if(addingCourse)
    {

    }
    else
    {

    }*/
    // This checks if a course can be taken in the same semester
    var concurrentCourseStrings = courseToAddRemove.Prerequisites.match(/[A-Z]{3,5}[*][0-9][0-9][0-9][0-9]( may be taken concurrently)/g);
    var concurrentCourses = [];

    if(concurrentCourseStrings != null)
    {
      for (var i = 0; i < concurrentCourseStrings.length; i++) {
        concurrentCourses = concurrentCourseStrings[i].match(/[A-Z]{3,5}[*][0-9][0-9][0-9][0-9]/g);
      }
    }



    console.log('These courses can be taken concurrently ' + concurrentCourses);

    return AddingCoursePrereqCheck(semesters, courseToAddRemove, selectedSemester, concurrentCourses);

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

// This checks all courses prereqs in the event of a course removal
function RemovingCoursePrereqCheck(semesters, courseToRemove, selectedSemester)
{

}

// This just checks if the prereqs for the added course are completed
function AddingCoursePrereqCheck(semesters, courseToAdd, selectedSemester, concurrentCourses)
{

  var prereqsObj = {separatedPrereqs : [], separationValue : ''};
  prereqsObj = GetSVPrereqsAndSepValue(courseToAdd.Prerequisites);
  console.log(prereqsObj);

  var fulfilledPrereqs = new Array(prereqsObj.separatedPrereqs.length);

  for (var i = 0; i < prereqsObj.separatedPrereqs.length; i++) {
    fulfilledPrereqs[i] = ResolvePrereqs(prereqsObj.separatedPrereqs[i], prereqsObj.separationValue,  semesters, selectedSemester, concurrentCourses);
  }

  console.log(fulfilledPrereqs);

  // This checks if the prereqs are completed for the last outer most separation value
  if(prereqsObj.separatedPrereqs.length == 0)
  {
    return true;
  }
  else if(prereqsObj.separatedPrereqs.length != 0 && selectedSemester == 0)
  {
    return false;
  }
  else if(prereqsObj.separationValue.match(/(or|1 of)/g) != null)
  {
    var isfulfilled = fulfilledPrereqs[0];

    for (var i = 1; i < fulfilledPrereqs.length; i++)
    {
      isfulfilled = isfulfilled || fulfilledPrereqs[i];
    }

    return isfulfilled;
  }
  else if(prereqsObj.separationValue.match(/(and|[,])/g) != null)
  {
    var isfulfilled = fulfilledPrereqs[0];

    for (var i = 1; i < fulfilledPrereqs.length; i++)
    {
      isfulfilled = isfulfilled && fulfilledPrereqs[i];
    }

    return isfulfilled;
  }
  else if(prereqsObj.separationValue.match(/(2 of)/g) != null)
  {

    for (var i = 0; i < fulfilledPrereqs.length; i++)
    {
      for(var j = i + 1; j < fulfilledPrereqs.length; j++)
      {
        if(fulfilledPrereqs[i] && fulfilledPrereqs[j] == true)
        {
          return true;
        }
      }
    }

    return false;
  }
  else
  {
    console.log('a case i didnt think of');
  }

  return null;
}

// this recursive function checks if the courses are completed and returns a true/false value
function ResolvePrereqs(prereq, separationValue, semesters, selectedSemester, concurrentCourses)
{
  // this is the base case of just one course to check
  if(prereq[0].match(/([\(]|[\[])/g) == null)
  {
    // Checking if the prereqs are fulfilled
    for (var i = 0; i < selectedSemester; i++) {
      for (var j = 0; j < semesters[i].courses.length; j++) {
        console.log(semesters[i].courses[j].Code + ' ' + prereq);
        if(semesters[i].courses[j].Code.trim() == prereq.trim())
        {
          console.log('returning true for ' + prereq);
          return true;
        }
      }

    }

    //Checks in case there is a course that can be taken concurrently
    if(concurrentCourses != null)
    {
      console.log('checking if concurrently taking course');
      for (var i = 0; i < semesters[selectedSemester].courses.length; i++) {
        for (var j = 0; j < concurrentCourses.length; j++) {
          console.log(prereq + ' ' + concurrentCourses[j]);
          if(concurrentCourses[j].trim() == prereq.trim() && semesters[selectedSemester].courses[i].Code.trim() == prereq.trim())
          {
            console.log('returning true for ' + prereq);
            return true;
          }
        }
      }
    }

    return false;

  }
  else
  {
    var prereqsObj = {separatedPrereqs : [], separationValue : ''};
    prereq = prereq.slice(1, prereq.length - 1);

    prereqsObj = GetSVPrereqsAndSepValue(prereq);
    console.log(prereqsObj);

    var fulfilledPrereqs = new Array(prereqsObj.separatedPrereqs.length);

    // recurse until a bool is returned
    for (var i = 0; i < prereqsObj.separatedPrereqs.length; i++)
    {
      fulfilledPrereqs[i] = ResolvePrereqs(prereqsObj.separatedPrereqs[i], prereqsObj.separationValue,  semesters, selectedSemester);
    }

    console.log(fulfilledPrereqs);

    //This checks the serparation value and evaluates the bool values
    if(prereqsObj.separationValue.match(/(or|1 of)/g) != null)
    {
      var isfulfilled = fulfilledPrereqs[0];

      for (var i = 1; i < fulfilledPrereqs.length; i++)
      {
        isfulfilled = isfulfilled || fulfilledPrereqs[i];
      }

      return isfulfilled;
    }
    else if(prereqsObj.separationValue.match(/(and|[,])/g) != null)
    {
      var isfulfilled = fulfilledPrereqs[0];

      for (var i = 1; i < fulfilledPrereqs.length; i++)
      {
        isfulfilled = isfulfilled && fulfilledPrereqs[i];
      }

      return isfulfilled;
    }
    else if(prereqsObj.separationValue.match(/(2 of)/g) != null)
    {

      for (var i = 0; i < fulfilledPrereqs.length; i++)
      {
        for(var j = i + 1; j < fulfilledPrereqs.length; j++)
        {
          if(fulfilledPrereqs[i] && fulfilledPrereqs[j] == true)
          {
            return true;
          }
        }
      }

      return false;
    }
    else
    {
      console.log('a case i didnt think of');
    }

  }
}

// returns the separated value prereqs and the separations value in one object
function GetSVPrereqsAndSepValue(Prerequisites)
{
  // array to hold value separated prereqs
  var prereqs = {separatedPrereqs : [], separationValue : ''};
  // string to hold only the course prereqs
  var prereqString = Prerequisites.match(/([\[]?[\(]?(([0-9] of )?[A-Z]{3,5}[*][0-9][0-9][0-9][0-9]([,][ ])?([ ][a-z]{2,3}[ ])?)+[\)]?[\]]?([,][ ])?([ ][a-z]{2,3}[ ])?)+/g);

  // puts the value separated prereqs
  for (var i = 0; i < prereqString[0].length; i++) {
    if(prereqString[0][i] == '[')
    {
      for (var j = i; j < prereqString[0].length; j++) {
        if(prereqString[0][j] == ']')
        {
          prereqs.separatedPrereqs.push(prereqString[0].substring(i, j + 1));
          i = j;
          break;
        }
      }
    }
    else if(prereqString[0][i] == '(')
    {
      for (var j = i; j < prereqString[0].length; j++) {
        if(prereqString[0][j] == ')')
        {
          prereqs.separatedPrereqs.push(prereqString[0].substring(i, j + 1));
          i = j;
          break;
        }
      }
    }
    else if(prereqString[0][i].match(/[A-Z]/g) != null)
    {
      for (var j = i; j < prereqString[0].length; j++) {
        if(prereqString[0][j] == ' ' || j == (prereqString[0].length - 1))
        {
          prereqs.separatedPrereqs.push(prereqString[0].substring(i, j + 1));
          i = j;
          break;
        }
        else if(prereqString[0][j] == ',')
        {
          prereqs.separatedPrereqs.push(prereqString[0].substring(i, j));
          i = j - 1;
          break;
        }
      }
    }
  }

  // this is for finding the separation value
  for (var i = 0; i < prereqString[0].length; i++) {
    if(prereqString[0].substring(0, 4).match(/([0-9] of)/) != null)
    {
      prereqs.separationValue = prereqString[0].substring(0, 4);
      break;
    }
    else if(prereqString[0][i] == ',')
    {
      prereqs.separationValue = ',';
      break;
    }
    else if(prereqString[0].substring(i, i + 2).match(/(or)/) != null)
    {
      prereqs.separationValue = 'or';
    }
    else if(prereqString[0].substring(i, i + 3).match(/(and)/) != null)
    {
      prereqs.separationValue = 'and';
    }
  }

  console.log(prereqString);

  return prereqs;
}
