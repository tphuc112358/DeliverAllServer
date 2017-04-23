var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('NorDb.db');

module.exports = (function() {
	'use strict';
	var router = require('express').Router();
	var b=["title","description","address","deli_address","deli_time","payment"];

	router.post('/api/rest/login', function (req,res) {

	});

	return router;
}();