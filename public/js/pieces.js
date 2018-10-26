//this will hopefully be a file to manage divs for drag and drop
// var app = angular.module("quilt_creator_app", []);
//
// app.controller("mainController", ["$http", "$scope", function($http, $scope) {
//
//   this.message = "the app.js file is attached!";
//
//
//   //set variables for usage in functions
//   this.url = "https://quilt-creator-api.herokuapp.com" ||
//   "http://localhost:3000";
//
//   //empty user object to get form data
//   this.user = {};
//   //form data for quilt blocks
//   this.quiltFormData = {};
//   //quilt block empty object
//   this.quilt_block = {};
//
//   //toggle to change views when logged in versus logged out
//   this.token = false;
//
//   //toggle to change views from banner to index
//   this.homeToIndex = false;
//   //toggle changes the show block to be visible
//   this.seeBlock = false;
//
//   this.changeView = function() {
//     this.homeToIndex = true;
//   };
//========QUILT BLOCK CREATE========//
//NEED TO PASS IN USERID
// this.createQuiltBlock = function(quilt_block, id) {
//   //this.user_id = id;
//   //console.log(JSON.parse(localStorage.getItem('token')));
//   //console.log(quilt_block);
//   //console.log(id);
//   $http({
//     method: "POST",
//     url: this.url + "/quilt_blocks",
//     data: {
//       quilt_block: quilt_block
//     },
//     headers: {
//       Authorization:
//       'Bearer ' + JSON.parse(localStorage.getItem('token'))
//     }
//   }).then(function(response) {
//     //console.log(response + "created quilt block");
//     //if 401 error message please login
//     if (response.data.status == ":unprocessable_entity") {
//     this.error = "Please Login to create a quilt";
//   } else if (response.data.status == 401) {
//     this.error = "Your total number of pieces does not match the number of triangled and whole squares, please check your entries.";
//   } else {
//     this.quilt_block = response.data.quilt_block;
//     this.quiltFormData = {};
//     this.getQuiltBlocks();
//     }
//   }.bind(this));
// };
