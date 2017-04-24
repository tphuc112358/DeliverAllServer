var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var column_login=["username","password"];
	var column_register=["username","password","email","phone"];
	var column_profile=["id","username","password","email","phone","transport","address","rating","free_status"];
	var column_profile_edit=["username","password","email","phone","transport","address","rating","free_status"];

	//check input
	var validate_request_param_auth = function(request_body,db_column)
	{
		var ret = [];
		if(request_body == undefined) {
			return false;
		}
		
		db_column.forEach(function(token) {
			if(request_body[token] == undefined || request_body[token] == "") {
				ret.push(token);
			}
		});
		return ret;
	};

	//login
	router.post('/api/rest/user/login', function (req,res) {

		var ret = (validate_request_param_auth(req.body,column_login));

		if(ret.length > 0) {
			//res.end('missing request params');
			res.json({result:false,missing:ret});		
		}

		db.all("SELECT * FROM User WHERE username=\""+req.body["username"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					if (req.body["password"] == rows[0]["password"]) {
						rows[0]["password"]=undefined;
						res.json({result:true,user:rows[0]});
					} else {
						res.json({result:false});
					}

				} else {
					res.json({result:false,status:"not existed username"});	
				}
			});

	});

	//register
	router.post('/api/rest/user/register', function (req,res) {

		var ret = (validate_request_param_auth(req.body,column_register));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}
		
		db.all("SELECT * FROM User WHERE username=\""+req.body["username"]+ "\""
			,function(err,rows){
				//check if already been regsistered
				if (rows.length>0) {
					res.json({result:false,status:"already registered"});	
				} else {
					var col_db="";
					var val_db="";
					column_register.forEach(function(token) {
						col_db+=token+",";
						val_db+=req.body[token]+"\",\"";
					});

					col_db = col_db.slice(0,-1);
					val_db = val_db.slice(0,-3);

					//add into db
					db.run("INSERT into User (" +col_db +") VALUES (\""+val_db+"\")");
					db.all("SELECT * FROM User WHERE username=\""+req.body["username"]+ "\""
						,function(err,rows){
							rows[0]["password"]= undefined;
							res.json({result:true,user:rows[0]});
						})
				}
			}); 
	});

	//profile
	router.post('/api/rest/user/profile/', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_profile));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}

		db.all("SELECT * FROM User WHERE id="+req.body["id"]
			,function(err,rows){
				//check if already been regsistered
				if (rows.length>0) {
					var result = "";
					
					column_profile_edit.forEach(function(token) {
						result += token+"=\""+req.body[token]+"\",";
					});
					result = result.slice(0,-1);
					//console.log("UPDATE User SET "+result+"  WHERE id="+req.body["id"]);
					db.run("UPDATE User SET "+result+"  WHERE id="+req.body["id"]);
					res.json({result:true,list:req.body});
				}
				else {
					res.json({result:false,status:"not existed username"});
				}
			});
	});


	return router;
})();