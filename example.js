var express = require('express')
var app = express()
var fs = require("fs");

//database
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('NorDb.db');
var check;

//allow origin header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//support parsing of application/json type post data
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//user
var user = require("./api/user.js");
app.use('/', user);

//request
var deli_request = require("./api/request.js");
app.use('/',deli_request);

//request by name
var request_by_name= require("./api/request_by_name.js");
app.use('/',request_by_name);

//listUser
app.get('/listUser', function (req,res) {
  fs.readFile( __dirname + "/" + "user.json", 'utf8', function (err, data) {
    users = JSON.parse(data);
    var user = users["user" + req.params.id]
    console.log( user );
    res.end( JSON.stringify(user) );
  });
})

//port
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})


