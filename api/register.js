module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var b=["username","password","email","phone"];

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

	router.post('/api/rest/register', function (req,res) {
		console.log(req.body);

		var ret = (validate_request_param_auth(req.body));

		if(ret.length > 0)
		{
			//res.end('missing request params');
			res.json({result:false,missing:ret});		
		}

		//handle register
  		res.json("ok");

	});


	return router;
})();