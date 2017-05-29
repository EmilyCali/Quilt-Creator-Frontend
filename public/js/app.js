var app = angular.module("quilt_creator_app", []);

app.controller("mainController", ["$http", "$scope", function($http, $scope) {

  this.message = "the app.js file is attached!";


  //set variables for usage in functions
  this.url = "http://localhost:3000"; //or heroku backend

  this.user = {};

  //this.formdData = {};

  //this.updatedData = {};

  this.quilt_block = {};

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

  //==========QUILT BLOCK CREATE==========//
//NEED TO PASS IN USERID
    this.createQuiltBlock = function(quilt_block, id) {
      //this.user_id = id;
      console.log(quilt_block);
      console.log(id);
      $http({
        method: "POST",
        url: this.url + "/quilt_blocks",
        data: {
          quilt_block: {
            title: quilt_block.title,
            difficulty: quilt_block.difficulty,
            //these will be a number, show multiple blocks to choose and give them numbers
            img: quilt_block.img,
            //may not need this, but could make it set automatically based on the image chosen
            num_pieces: quilt_block.num_pieces,
            piece_size: quilt_block.piece_size,
            style: quilt_block.style,
            triangles: quilt_block.triangles,
            squares: quilt_block.squares
          }
        },
        headers: {
          Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(function(response) {
        console.log(response + "created quilt block");
          // if 401 error message please login
          if (response.data.status == 401) {
            this.error = "Please Login to create a quilt";
          } else {
            this.quilt_block = response.data.quilt_block;
            this.getQuiltBlocks();
          }
      }.bind(this));
    };

  //===========QUILT BLOCK INDEX===========//

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

  //============QUILT BLOCK SHOW=============//

    this.getQuiltBlock = function(id) {
      console.log(id);
      $http({
        method: "GET",
        url: this.url + "/quilt_blocks" + id,
      }).then(function(response) {
        console.log(response);
        this.quilt_block = response.data;
      }.bind(this));
    };

  //=============QUILT BLOCK DELETE==========//

  //============QUILT BLOCK MATH============//

    //baby 36 x 60
    //twin 70 x 90
    //full/double 84 x 90
    //queen 90 x 95
    //king 108 x 95
//DENOTE THAT FABRIC IS BEING ASSUMED AT 44 INCHES WIDE
    //pass in the quilt_block, need an http?
    this.quiltBlockCalc = function(id) {
      console.log(quilt_block);
      $http({
        method: "GET",
        url: this.url + "/quilt_blocks" + id,
      }).then(function(response) {
        this.quilt_block = response.data;

        //square pieces measurement with seams
        this.squareWithSeams = this.quilt_block.piece_size + 0.5;

        this.squaresFabric = this.squareWithSeams * this.quilt_block.squares;

        //triangle pieces with seams
        this.triangleWithSeams = this.quilt_block.piece_size + 0.75;

        this.trianglesFabric = this.triangleWithSeams * this.quilt_block.triangles;

        //total fabric for a block
        this.totalBlockFabric = this.squaresFabric + this.trianglesFabric;

        // calcs for quilt sizes
        //if quilt size is baby
        //if quilt size is twin
        //if quilt size is full
        //if quilt size is queen
        //fi quilt size is king

      }.bind(this));
    };
}]);
