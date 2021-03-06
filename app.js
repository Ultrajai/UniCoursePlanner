UniCoursePlanner = angular.module("UniCoursePlanner", ["ngRoute"]);

// UniCoursePlanner.config("$routeProvider", function($routeProvider){
//
//   //this is the before the page even loads
// });

UniCoursePlanner.filter('CourseFilter', function(){
  // Just add arguments to your HTML separated by :
  // And add them as parameters here, for example:
  // return function(dataArray, searchTerm, argumentTwo, argumentThree) {
  return function(dataArray, searchTerm) {
      // If no array is given, exit.
      if (!dataArray) {
          return;
      }
      // If no search term exists, return the array unfiltered.
      else if (!searchTerm) {
          return;
      }
      // Otherwise, continue.
      else {
           // Return the array and filter it by looking for any occurrences of the search term in each items Code or Title
           return dataArray.filter(function(item){
             term = this.toLowerCase();
             var termInCode = item.Code.toLowerCase().indexOf(term) > -1; // returns true if there is an instance of the term
             var termInTitle = item.Title.toLowerCase().indexOf(term) > -1; // returns true if there is an instance of the term
             return termInCode || termInTitle;
           }, searchTerm);
      }
  }
});



UniCoursePlanner.controller("MainController", function($scope, $http){

  $scope.courses = [];
  $scope.numOfSemesters = 0;
  $scope.season = ['Fall', 'Winter', 'Summer'];
  $scope.semesters = [];
  $scope.searchString = "";
  $scope.selectedSemester = 0;

  $scope.AddSemesterListener = function(){
    $scope.semesters.push({num : $scope.numOfSemesters, season : $scope.season[$scope.numOfSemesters % 3], courses : []});
    $scope.numOfSemesters = $scope.numOfSemesters + 1;
  };

  // updates the search criteria when entered or search is selected
  $scope.SearchCoursesListener = function(){
    $scope.searchString = $scope.searchText;
  };

  $scope.AddCoursesListener = function(courseData){

    //send course data to validate
    $http({
      method: 'POST',
      url: '/CourseValidation',
      data: {course : courseData, semesters : $scope.semesters, selectedSemester: $scope.selectedSemester, addingCourse : true},
    }).then(function successCallback(response) {
        console.log(response.data)
        $scope.semesters[$scope.selectedSemester].courses.push(courseData);
      }, function errorCallback(response) {
        console.log(response);
      });

  };

  // A listener that selects the semester where the user will add courses to
  $scope.SemesterSelecterListener = function(semester){
    $scope.selectedSemester = semester.num
  };

  $scope.RemoveCourse = function(semester, courseToDelete){
    for(var i = 0; i < $scope.semesters[semester.num].courses.length; i++){
      if(courseToDelete.Code == $scope.semesters[semester.num].courses[i].Code){
        $scope.semesters[semester.num].courses.splice(i, 1);
      }
    }

    //send course data to validate
    $http({
      method: 'POST',
      url: '/CourseValidation',
      data: {course : courseToDelete, semesters : $scope.semesters, selectedSemester: semester.num, addingCourse : false},
    }).then(function successCallback(response) {
        console.log(response.data)
      }, function errorCallback(response) {
        console.log(response);
      });
  };

  //get all courses so that the webapp has access to all data from startup definitely not keeping this afterwards
  $http({
    method: 'GET',
    url: '/GetAllCourses'
  }).then(function successCallback(response) {
      for (var i = 0; i < response.data.length; i++) {
          $scope.courses.push(response.data[i]);
      }
    }, function errorCallback(response) {
      console.log(response);
    });

  //this controls the body
});
