var app = angular.module("quilt_creator_app", []);

app.controller("mainController", ["$http", "$scope", function($http, $scope) {

  this.message = "the app.js file is attached!";


  //set variables for usage in functions
  this.url = //"https://quilt-creator-api.herokuapp.com" ||
  "http://localhost:3000";

  //empty user object to get form data
  this.user = {};
  //form data for quilt blocks
  this.quiltFormdData = {};
  //quilt block empty object
  this.quilt_block = {};

  //toggle to change views when logged in versus logged out
  this.token = false;

  //toggle to change views from banner to index
  this.homeToIndex = false;

  this.changeView = function() {
    this.homeToIndex = true;
  };

  //===========CREATE USER============//

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

  //==========LOGIN USER==========//

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
        this.token = true;
      }
    }.bind(this));
  };

  //===========USER LOGOUT===========//

  this.logout = function() {
    this.token = false;
    localStorage.clear("token");
    location.reload();
  };

  //===========USER EDIT===========//

  this.editUser = function(user, id) {
    console.log(user);
    console.log(id);
    $http({
      method: "PUT",
      url: this.url + "/users/" + id,
      data :{
        user: user
        // user: {
        //   favorite_block: user.favorite_block,
        //   years_quilting: user.years_quilting
        // }
      },
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.getUser(response.data.id);
        this.user = response.data;
      }
    }.bind(this));
  };


  //===========USER SHOW============//

  this.getUser = function(id) {
    $http({
      method: "GET",
      url: this.url + "/users/" + id, //localStorage.getItem("userId"),
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
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

  //===========USER GETID===========//

  //==========USER DELETE===========//

  this.deleteUser = function(id) {
    console.log("delete clicked");
    $http({
      method: "DELETE",
      url: this.url + "/users/" + id,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response + "delete");
      this.logout();
    }.bind(this));
  };

  //========QUILT BLOCK CREATE========//
  //NEED TO PASS IN USERID
  this.createQuiltBlock = function(quilt_block, id) {
    //this.user_id = id;
    console.log(JSON.parse(localStorage.getItem('token')));
    console.log(quilt_block);
    console.log(id);
    $http({
      method: "POST",
      url: this.url + "/quilt_blocks",
      data: {
        quilt_block: quilt_block
      },
      headers: {
        Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response + "created quilt block");
      // if 401 error message please login
      //if (response.data.status == 401) {
      //this.error = "Please Login to create a quilt";
      //} else {
      //this.quilt_block = response.data.quilt_block;
      this.quiltFormdData = {};
      this.getQuiltBlocks();
      //}
    }.bind(this));
  };



  //========QUILT BLOCK SHOW========//
  //this.quiltBlockId = "";

  // this.showQuiltBlock = function(id) {
  //   this.quiltBlockId = id;
  // };

  this.getQuilt = function(id) {
    //this.quiltBlockId = id;
    console.log("getting one quilt block");
    console.log(id);
    $http({
      method: "GET",
      url: this.url + "/quilt_blocks/" + id,
    }).then(function(response) {
      console.log(response);
      this.quilt_block = response.data;
      this.quiltBlockCalc(id);
    }.bind(this));
  };

  //=========QUILT BLOCK DELETE=======//

  //=======QUILT BLOCK MATH========//

  //baby 36 x 60
  //twin 70 x 90
  //full/double 84 x 90
  //queen 90 x 95
  //king 108 x 95

  this.quiltBlockCalc = function() {
    //square pieces measurement with seams
    this.squareWithSeams = this.quilt_block.piece_size + 0.5;
    //cuts you can make across the width of the fabric assumed at 40 inches wide
    this.squareCutsFabric = 40 / this.squareWithSeams;
    //strips you can make based on number of squares and the cuts determined
    this.squareStrips = this.quilt_block.squares / this.squareCutsFabric;
    //length of fabric you will need
    this.squareFabricLength = this.squareStrips * this.squareWithSeams;
    //length determined divided by 36 whihc is 1 yard
    this.squareYardage = this.squareFabricLength / 36;

    //triangle pieces with seams
    this.triangleWithSeams = this.quilt_block.piece_size + 0.75;
    //cuts you can make across the width of the fabric assumed at 40 inches wide
    this.triangleCutsFabric = 40 / this.triangleWithSeams;
    //strips you can make based on number of squares and the cuts determined
    this.triangleStrips = this.quilt_block.triangles / this.triangleCutsFabric;
    //length of fabric you will need
    this.triangleFabricLength = this.triangleStrips * this.triangleWithSeams;
    //length determined divided by 36 whihc is 1 yard
    this.triangleYardage = this.triangleFabricLength / 36;

    // total yardage needed for the block
    this.quiltBlockYardage = this.squareYardage + this.triangleYardage;

    // calcs for quilt sizes
    //if quilt size is baby
    //if quilt size is twin
    //if quilt size is full
    //if quilt size is queen
    //fi quilt size is king

    //}.bind(this));
  };

  //====SAVE QUILT BLOCK YARDAGE=====//

  this.saveQuiltBlockYardage = function(quiltBlockYardage, id) {
    quiltBlockYardage = this.quiltBlockYardage;
    console.log(quiltBlockYardage);
    console.log(id);
    $http({
      method: "PUT",
      url: this.url + "/quilt_blocks" + id,
      data: {
        quiltBlockYardage : this.quilt_block.yardage
      },
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
        this.error = "You need to login or you do not own this quilt block";
      } else {
        this.getQuiltBlock(response.data._id);
        this.quilt_block = response.data;
        //this.quilt_block = response.data.quilt_block;
        this.getQuiltBlocks();
      }
    }.bind(this));
  };

  //=========QUILT BLOCK INDEX=========//

  this.getQuiltBlocks = function() {
    $http({
      method: "GET",
      url: this.url + "/quilt_blocks",
    }).then(function(response) {
      console.log(response);
      this.quilt_blocks = response.data;
      //console.log(this.recipes);
    }.bind(this));
  };

  this.getQuiltBlocks();

  //=================MODALS================//

  //===========SIGNUP MODAL============//
  $("#signup").on("click", function() {
    $("#signup-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#signup-modal").css("display", "none");
  });

  //===========LOGIN MODAL============//
  $("#login").on("click", function() {
    $("#login-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#login-modal").css("display", "none");
  });

  //===========EDIT USER MODAL============//
  $("#edit-user").on("click", function() {
    $("#edit-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#edit-modal").css("display", "none");
  });

  //===========CREATE MODAL============//
  $("#create-quilt").on("click", function() {
    $("#create-quilt-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#create-quilt-modal").css("display", "none");
  });

  //===========SHOW QUILT============//
  $("#indexed").on("click", function() {
    $("#show-quilt").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#show-quilt").css("display", "none");
  });

  //===========ABOUT MODAL============//
  $("#about").on("click", function() {
    $("#about-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#about-modal").css("display", "none");
  });

  //===========FAQ MODAL============//
  $("#faq").on("click", function() {
    $("#faq-modal").css("display", "block");
  });

  $(".close").on("click", function() {
    $("#faq-modal").css("display", "none");
  });

}]);
