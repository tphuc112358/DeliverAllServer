var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var b=["courier_user","delivery_id"];

	var validate_request_param_auth = function(request_body) {
		var ret = [];
		if(request_body == undefined) {
 			return false;
		}
		
		b.forEach(function(token) {
			if(request_body[token] == undefined || request_body[token] == "") {
				ret.push(token);
			}
		});
		
		return ret;
	};


	router.post('/api/rest/apply/', function(req,res) {

		var ret = (validate_request_param_auth(req.body));

		if(ret.length > 0) {
			res.json({result:false,missing:ret});			
		}

		db.all("SELECT * FROM Request WHERE delivery_id=\""+req.body["delivery_id"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					res.json({result:true,list:rows})
				} else {
					res.json({result:false,list:[]});
				}
			});
	});

	return router;
})();