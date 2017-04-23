var express = require('express')
var app = express()
var fs = require("fs");

//database
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('NorDb.db');
var check;


//support parsing of application/json type post data
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//register
var register = require("./api/register.js");
app.use('/', register);

//login
var login = require("./api/login.js");
app.use('/', login);

//var deli_request = require("./api/request.js");
//app.use('/',deli_request);


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
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

