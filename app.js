UniCoursePlanner = angular.module("UniCoursePlanner", ["ngRoute"]);

// UniCoursePlanner.config("$routeProvider", function($routeProvider){
//
//   //this is the before the page even loads
// });

UniCoursePlanner.controller("MainController", function($scope){

  $scope.numOfSemesters = 0;
  $scope.season = ['Fall', 'Winter', 'Summer'];
  $scope.semesters = [];

  $scope.AddSemester = function(){
    $scope.semesters.push({num : $scope.numOfSemesters, season : $scope.season[$scope.numOfSemesters % 3]});
    $scope.numOfSemesters += 1;
  };

  //this controls the body
});
