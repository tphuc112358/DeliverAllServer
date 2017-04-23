var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();

	
	router.post('/api/rest/request/:username', function(req,res) {

	});

	return router;
})();