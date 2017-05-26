var app = angular.module("quilt_creator_app", []);

// app.config(function($routeProvider) {
//   $routeProvider
//
//   .when("/", {
//     templateUrl : "index.html",
//     controller : "mainController"
//   })
//
//   .when("/users/login", {
//     templateUrl : "views/login.html",
//     controller : "mainController"
//   })
//
//    .when("/users", {
//      templateUrl : "views/createAccount.html",
//      controller: "mainController"
//    })
// });

app.controller("mainController", ["$http", "$scope", function($http, $scope) {

  this.message = "the app.js file is attached!";


  //set variables for usage in functions
  this.url = "http://localhost:3000"; //or heroku backend

  this.user = {};

  this.formdData = {};

  this.updatedData = {};

  this.quilt = {};

  //toggle to change views
  //this.token = false;

//===============CREATE USER===============//

  this.createAccount = function(user) {
    console.log(user);

    $http({
      method: "POST",
      url: this.url + "/users",
      data: {
        //there are more fields to a user but for now we only want to create with a username and password
        user: {
          username: user.username,
          password: user.password
        }
      },
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
    }.bind(this));
  };

//===============LOGIN USER===============//

  this.login = function(user) {
    console.log(user);

    $http({
      method: "POST",
      url: this.url + "/users/login",
      data: {
        user: {
          username: user.username,
          password: user.password
        }
      },
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
        this.error = "Please try again";
      } else {
        this.user = response.data.user;
        localStorage.setItem("token", JSON.stringify(response.data.token));
        //toggle for token validation to make certain parts of the page show and not show with ngs
        //this.token = true;
      }
    }.bind(this));
  };

//===============USER LOGOUT===============//

  this.logout = function() {
    //this.token = false;
    localStorage.clear("token");
    location.reload();
  };

//===============USER EDIT===============//

//===============USER SHOW===============//

//===============USER GETID===============//

//===============USER DELETE===============//



//===============QUILT CREATE=============//

//===============QUILT INDEX===============//

//===============QUILT SHOW===============//

//===============QUILT DELETE=============//

//===============QUILT MATH===============//


}]);
