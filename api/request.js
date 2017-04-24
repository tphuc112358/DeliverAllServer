var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var column_request=["title","description","address","deli_address","deli_time","payment","creator_user"];
	var column_edit=["request_id","title","description","address","deli_address","deli_time","payment","creator_user"];
	var column_apply=["request_id","courier_user"];
	var column_delete=["request_id","creator_user"];
	var column_getrequest = ["request_id"];
	//validate input
	var validate_request_param_auth = function(request_body,db_collumn)
	{
		var ret = [];
		if(request_body == undefined) {
			return false;
		}
		
		db_collumn.forEach(function(token) {
			if(request_body[token] == undefined || request_body[token] == "") {
				ret.push(token);
			}
		});
		return ret;
	};

	//create new request
	router.post('/api/rest/request/create', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_request));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}

		var col_db="";
		var val_db="";
		column_request.forEach(function(token) {
			col_db+=token+",";
			val_db+=req.body[token]+"\",\"";
		});

		col_db = col_db.slice(0,-1);
		val_db = val_db.slice(0,-3);

		//add into db
		db.run("INSERT into Request (" +col_db +") VALUES (\""+val_db+"\")");
		res.json({result:true,list:req.body});
	});

	//edit new request
	router.post('/api/rest/request/edit', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_edit));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}

		db.all("SELECT * FROM Request WHERE request_id=\""+req.body["request_id"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					var result = "";
					
					column_request.forEach(function(token) {
						result += token+"=\""+req.body[token]+"\",";
					});
					result = result.slice(0,-1);

					db.run("UPDATE Request SET "+result+"  WHERE request_id="+req.body["request_id"]);

					res.json({result:true,list:req.body});
				} else {
					res.json({result:false,message:"invalid request_id"});
				}
			});		
	});

	//get request for username
	router.get('/api/rest/request/create/:creator_user', function (req,res) {
		if (req.params["creator_user"]==undefined) {
			req.json({result:false,missing:ret});	
		}

		db.all("SELECT * FROM Request WHERE creator_user=\""+req.params["creator_user"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					res.json({result:true,list:rows})
				} else {
					res.json({result:true,list:[]});
				}
			});
	});

	//apply for delivery
	router.post('/api/rest/request/apply', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_apply));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}
		db.all("SELECT * FROM Request WHERE request_id="+req.body["request_id"]
			,function(err,rows){
				if (rows.length>0) {
					db.run("UPDATE Request SET courier_user =\""+req.body["courier_user"]+"\"WHERE request_id ="+req.body["request_id"],{},function(){
						res.json({result:true,request:rows});
					});
					
				} else {
					res.json({result:false,message:"invalid request_id"});
				}
			});
	});

	//open free delivery message for applying
	router.get('/api/rest/request/open/:creator_user', function (req,res) {
		if (req.params["creator_user"]==undefined) {
			req.json({result:false,missing:ret});	
		}

		db.all("SELECT * FROM Request WHERE creator_user!=\""+req.params["creator_user"]+ "\" AND courier_user is NULL"
			,function(err,rows){
				if (rows.length>0) {
					res.json({result:true,list:rows})
				} else {
					res.json({result:true,list:[]});
				}
			});
	});

	//get all the request
	router.post('/api/rest/request/all', function(req,res){
		db.all("SELECT * FROM Request", function(err,rows){
			res.json({result:true,list:rows});
		})
	});

	//delete delivery
	router.post('/api/rest/request/delete', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_delete));

		if(ret.length > 0) {
			//res.end('missing request params');
			res.json({result:false,missing:ret});		
		}

		db.all("SELECT * FROM Request WHERE creator_user=\""+req.body["creator_user"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					db.run("DELETE FROM Request WHERE request_id = "+req.body["request_id"]);
					res.json({result:true});
				} else {
					res.json({result:false,status:"invalid user"});	
				}
			});
	});

	//get my delivery request
	router.get('/api/rest/request/incoming/:courier_user', function (req,res) {
		if (req.params["courier_user"]==undefined) {
			req.json({result:false,missing:ret});	
		}

		db.all("SELECT * FROM Request WHERE courier_user=\""+req.params["courier_user"]+"\""
			,function(err,rows){
				if (rows.length>0) {
					res.json({result:true,list:rows})
				} else {
					res.json({result:true,list:[]});
				}
			});
	});

	//reject service already taken
	router.post('/api/rest/request/reject', function (req,res) {
		var ret = (validate_request_param_auth(req.body,column_apply));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}
		
		db.all("SELECT * FROM Request WHERE request_id="+req.body["request_id"]+" AND courier_user=\""+req.body["courier_user"]+"\""
			,function(err,rows){
				if (rows.length>0  ) {
					db.run("UPDATE Request SET courier_user = NULL WHERE request_id = "+req.body["request_id"],{},function(){
						res.json({result:true,request:rows});
					});
				} else {
					res.json({result:false,message:"invalid request_id or courier_user"});
				}
			});			
	});

	return router;

})();