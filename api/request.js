var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var b=["title","description","address","deli_address","deli_time","payment","creator_user"];

	var validate_request_param_auth = function(request_body)
	{
		var ret = [];
		if(request_body == undefined)
		{
 			return false;
		}
		
		b.forEach(function(token) {
			if(request_body[token] == undefined || request_body[token] == "")
			{
				ret.push(token);
			}
		});
		
		return ret;
	};

	router.post('/api/rest/request', function (req,res) {
		var ret = (validate_request_param_auth(req.body));

		if(ret.length > 0)
		{
			res.json({result:false,missing:ret});			
		}

		var col_db="";
		var val_db="";
		b.forEach(function(token) {
			col_db+=token+",";
			val_db+=req.body[token]+"\",\"";
		});

		col_db = col_db.slice(0,-1);
		val_db = val_db.slice(0,-3);

		//add into db
		db.run("INSERT into Request (" +col_db +") VALUES (\""+val_db+"\")");
		res.json({result:"succesful"});
	});

	router.post('/api/rest/request/:username', function(req,res) {

	});

	return router;
})();