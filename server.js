//require npms

var express = require("express");
var app = express();
//body parser?
var port = process.env.PORT || 8000;

//Middleware
app.use(express.static("public"));
//use body parser
//app.use(bodyParser.json());

app.listen(port, function() {
  console.log("frontend running on port: ", port);
});
