'use strict';
var express = require('express');
var url_shortener = require('../will-is-coding/url-shortener');
var router = express.Router();
var path = process.cwd();

router.get('/', function(req, res) {
    res.sendFile(path + '/public/index.html');
});

router.get('/:short', function(req, res) {
    var short_url = req.params.short;
		
	var retrieved_url = url_shortener.fetch_short_url( short_url );

	if( retrieved_url.valid == true ) {
		if( typeof(retrieved_url.retrieved) == "string" )
			res.redirect(retrieved_url.retrieved);
		else
			res.send( JSON.stringify(retrieved_url.retrieved) );
	}
	else
		res.send( JSON.stringify(retrieved_url.error) );
});

router.get('/new/*', function(req, res) {
    var new_link = url_shortener.shortern_url( req.originalUrl, false );
	if( new_link.hasOwnProperty("retrieved") )
		res.send( JSON.stringify( new_link.retrieved ) );
	else if ( new_link.hasOwnProperty("error") )
		res.send( JSON.stringify(new_link) );
});

module.exports = router;