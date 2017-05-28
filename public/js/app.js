var app = angular.module("quilt_creator_app", []);

app.controller("mainController", ["$http", "$scope", function($http, $scope) {

  this.message = "the app.js file is attached!";


  //set variables for usage in functions
  this.url = "http://localhost:3000"; //or heroku backend

  this.user = {};

  //this.formdData = {};

  //this.updatedData = {};

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
      if (response.status == 401) {
        this.error = "Please try again, the username may be taken or you have not filled these fields.";
      } else {
        this.user = response.data.user;
      }
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

  this.editUser = function(user, id) {
    console.log(user);
    console.log(id);
    $http({
      method: "PUT",
      url: this.url + "/users/" + id,
      data :{
        user: {
          favorite_block: user.favorite_block,
          years_quilting: user.years_quilting
        }
      },
      headers: {
        Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.getUser(response.data._id);
        this.user = response.data;
      }
    }.bind(this));
  };


  //===============USER SHOW===============//

  this.getUser = function(id) {
    $http({
      method: "GET",
      url: this.url + "/users/" + id, //localStorage.getItem("userId"),
      headers: {
        Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.user = response.data;
      }
    }.bind(this));
  };

  //===============USER GETID===============//

  //===============USER DELETE===============//

    this.deleteUser = function(id) {
      console.log("delete clicked");
      $http({
        method: "DELETE",
        url: this.url + "/users/" + id,
        headers: {
          Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(function(response) {
        console.log(response + "delete");
        this.logout();
      }.bind(this));
    };



  //===============QUILT CREATE=============//

    this.createBlock = function() {
      $http({
        method: "POST",
        url: this.url + "/blocks",
        data: {
          block: {
            title: block.title,
            difficulty: block.difficulty
          }
        },
        headers: {
          Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(function(response) {

      });
    };

  //===============QUILT INDEX===============//

    this.getQuiltBlocks = function() {
      $http({
        method: "GET",
        url: this.url + "/blocks",
      }).then(function(response) {
        console.log(response);
        this.blocks = response.data;
      //console.log(this.recipes);
      }.bind(this));
    };

    this.getQuiltBlocks();

  //===============QUILT SHOW===============//

    this.getQuiltBlock = function() {

    };

  //===============QUILT DELETE=============//

  //===============QUILT MATH===============//


}]);
