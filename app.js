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
             var termInCode = item.Code.toLowerCase().indexOf(term) > -1; // returns true if there is ansintance of the term
             var termInTitle = item.Title.toLowerCase().indexOf(term) > -1; // returns true if there is ansintance of the term
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

  $scope.AddSemester = function(){
    $scope.semesters.push({num : $scope.numOfSemesters, season : $scope.season[$scope.numOfSemesters % 3]});
    $scope.numOfSemesters += 1;
  };

  $scope.SearchCourses = function(){
    $scope.searchString = $scope.searchText;
  };

  //get all courses so that the webapp has access to all data from startup
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
