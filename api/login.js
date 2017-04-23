var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var b=["username","password"];

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

	router.post('/api/rest/login', function (req,res) {
		console.log(req.body);

		var ret = (validate_request_param_auth(req.body));

		if(ret.length > 0)
		{
			//res.end('missing request params');
			res.json({result:false,missing:ret});		
		}

		db.all("SELECT * FROM User WHERE username=\""+req.body["username"]+ "\""
			,function(err,rows){
				if (rows.length>0) {
					if (req.body["password"] == rows[0]["password"]) {
						rows[0]["password"]=undefined;
						res.json(rows[0]);
					} else {
						res.json({result:false});
					}

				} else {
					res.json({result:false,status:"not existed username"});	
				}
			});

	});

	return router;
})();