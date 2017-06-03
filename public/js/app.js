var app = angular.module("quilt_creator_app", []);

app.controller("mainController", ["$http", "$scope", function($http, $scope) {

  this.message = "the app.js file is attached!";


  //set variables for usage in functions
  this.url = "https://quilt-creator-api.herokuapp.com" ||
  "http://localhost:3000";

  //empty user object to get form data
  this.user = {};
  //form data for quilt blocks
  this.quiltFormData = {};
  //quilt block empty object
  this.quilt_block = {};

  //toggle to change views when logged in versus logged out
  this.token = false;

  //toggle to change views from banner to index
  this.homeToIndex = false;
  //toggle changes the show block to be visible
  this.seeBlock = false;

  this.changeView = function() {
    this.homeToIndex = true;
  };

  //===========CREATE USER============//

  this.createAccount = function(user) {
    //console.log(user);
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
      //console.log(response);
      if (response.status == 401) {
        this.error = "Please try again, the username may be taken or you have not filled these fields.";
      } else {
        this.user = response.data.user;
      }
    }.bind(this));
  };

  //==========LOGIN USER==========//

  this.login = function(user) {
    //console.log(user);
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
      //console.log(response);
      if (response.data.status == 401) {
        // this is for if the user doesn't exist or if they have entered the wrong password or username or have left them blank
        this.error = "Please try again";
      } else {
        this.user = response.data.user;
        //give them a token
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
    //console.log(user);
    //console.log(id);
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
      //console.log(response);
      if (response.data.status == 422) {
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
      //console.log(response);
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
    //console.log("delete clicked");
    $http({
      method: "DELETE",
      url: this.url + "/users/" + id,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      //console.log(response + "delete");
      if (response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.logout();
      }
    }.bind(this));
  };

  //========QUILT BLOCK CREATE========//
  //NEED TO PASS IN USERID
  this.createQuiltBlock = function(quilt_block, id) {
    //this.user_id = id;
    //console.log(JSON.parse(localStorage.getItem('token')));
    //console.log(quilt_block);
    //console.log(id);
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
      //console.log(response + "created quilt block");
      //if 401 error message please login
      if (response.data.status == ":unprocessable_entity") {
      this.error = "Please Login to create a quilt";
    } else if (response.data.status == 401) {
      this.error = "Your total number of pieces does not match the number of triangled and whole squares, please check your entries.";
    } else {
      this.quilt_block = response.data.quilt_block;
      this.quiltFormData = {};
      this.getQuiltBlocks();
      }
    }.bind(this));
  };



  //========QUILT BLOCK SHOW========//
  //this.quiltBlockId = "";

  // this.showQuiltBlock = function(id) {
  //   this.quiltBlockId = id;
  // };

  this.getQuilt = function(id) {
    //this.quiltBlockId = id;
    //console.log("getting one quilt block");
    //console.log(id);
    $http({
      method: "GET",
      url: this.url + "/quilt_blocks/" + id,
    }).then(function(response) {
      //console.log(response);
      this.seeBlock = true;
      this.quilt_block = response.data;
      this.quiltBlockCalc(id);
    }.bind(this));
  };

  //=========QUILT BLOCK DELETE=======//

  //=======QUILT BLOCK MATH========//



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
    this.triangleWithSeams = this.quilt_block.piece_size + 0.875;
    //cuts you can make across the width of the fabric assumed at 40 inches wide
    this.triangleCutsFabric = 40 / this.triangleWithSeams;
    //strips you can make based on number of squares and the cuts determined
    this.triangleStrips = this.quilt_block.triangles / this.triangleCutsFabric;
    //length of fabric you will need
    this.triangleFabricLength = this.triangleStrips * this.triangleWithSeams;
    //length determined divided by 36 whihc is 1 yard
    this.triangleYardage = this.triangleFabricLength / 36;

    // total yardage needed for the block
    this.quiltBlockYardageBeforeRounding = this.squareYardage + this.triangleYardage;

    // solution found in combination with https://stackoverflow.com/questions/1553704/round-to-nearest-25-javascript and testing division by four and rounding
    this.quiltBlockYardage = (Math.round(this.quiltBlockYardageBeforeRounding * 4)/4).toFixed(2);

    // calcs for quilt sizes
    this.blockLength = this.quilt_block.piece_size * Math.sqrt(this.quilt_block.num_pieces);
    //if quilt size is baby 36 x 60
    this.babyLength = 60 / this.blockLength;
    this.babyWidth = 36 / this.blockLength;
    this.babyAreaBlocks = this.babyLength * this.babyWidth;
    this.babyYardageBeforeRound = this.babyAreaBlocks * this.quiltBlockYardageBeforeRounding;
    this.babyYardage = (Math.round(this.babyYardageBeforeRound * 4)/4).toFixed(2);

    //if quilt size is twin 70 x 90
    this.twinLength = 90 / this.blockLength;
    this.twinWidth = 70 / this.blockLength;
    this.twinAreaBlocks = this.twinLength * this.twinWidth;
    this.twinYardageBeforeRound = this.twinAreaBlocks * this.quiltBlockYardageBeforeRounding;
    this.twinYardage = (Math.round(this.twinYardageBeforeRound * 4)/4).toFixed(2);

    //if quilt size is full 84 x 90
    this.fullLength = 90 / this.blockLength;
    this.fullWidth = 84 / this.blockLength;
    this.fullAreaBlocks = this.fullLength * this.fullWidth;
    this.fullYardageBeforeRound = this.fullAreaBlocks * this.quiltBlockYardageBeforeRounding;
    this.fullYardage = (Math.round(this.fullYardageBeforeRound * 4)/4).toFixed(2);

    //if quilt size is queen 90 x 95
    this.queenLength = 95 / this.blockLength;
    this.queenWidth = 90 / this.blockLength;
    this.queenAreaBlocks = this.queenLength * this.queenWidth;
    this.queenYardageBeforeRound = this.queenAreaBlocks * this.quiltBlockYardageBeforeRounding;
    this.queenYardage = (Math.round(this.queenYardageBeforeRound * 4)/4).toFixed(2);

    //fi quilt size is king 108 x 95
    this.kingLength = 108 / this.blockLength;
    this.kingWidth = 95 / this.blockLength;
    this.kingAreaBlocks = this.kingLength * this.kingWidth;
    this.kingYardageBeforeRound = this.kingAreaBlocks * this.quiltBlockYardageBeforeRounding;
    this.kingYardage = (Math.round(this.kingYardageBeforeRound * 4)/4).toFixed(2);
  };

  //====SAVE QUILT BLOCK YARDAGE=====//

  // this.saveQuiltBlockYardage = function(quiltBlockYardage, id) {
  //   quiltBlockYardage = this.quiltBlockYardage;
  //   console.log(quiltBlockYardage);
  //   console.log(id);
  //   $http({
  //     method: "PUT",
  //     url: this.url + "/quilt_blocks" + id,
  //     data: {
  //       quiltBlockYardage : this.quilt_block.yardage
  //     },
  //     headers: {
  //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
  //     }
  //   }).then(function(response) {
  //     console.log(response);
  //     if (response.data.status == 401) {
  //       this.error = "You need to login or you do not own this quilt block";
  //     } else {
  //       this.getQuiltBlock(response.data._id);
  //       this.quilt_block = response.data;
  //       //this.quilt_block = response.data.quilt_block;
  //       this.getQuiltBlocks();
  //     }
  //   }.bind(this));
  // };

  //=========QUILT BLOCK INDEX=========//

  this.getQuiltBlocks = function() {
    $http({
      method: "GET",
      url: this.url + "/quilt_blocks",
    }).then(function(response) {
      //console.log(response);
      this.quilt_blocks = response.data;
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
  // $("#quilt-title").on("click", function() {
  //   $("#show-quilt").css("display", "block");
  // });
  //
  // $(".close").on("click", function() {
  //   $("#show-quilt").css("display", "none");
  // });

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
