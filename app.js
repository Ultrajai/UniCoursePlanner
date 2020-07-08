UniCoursePlanner = angular.module("UniCoursePlanner", ["ngRoute"]);

// UniCoursePlanner.config("$routeProvider", function($routeProvider){
//
//   //this is the before the page even loads
// });

UniCoursePlanner.controller("MainController", function($scope, $http){

  $scope.courses = [];
  $scope.numOfSemesters = 0;
  $scope.season = ['Fall', 'Winter', 'Summer'];
  $scope.semesters = [];

  $scope.AddSemester = function(){
    $scope.semesters.push({num : $scope.numOfSemesters, season : $scope.season[$scope.numOfSemesters % 3]});
    $scope.numOfSemesters += 1;
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
