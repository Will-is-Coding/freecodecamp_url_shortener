'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var myURL = "https://freecodecamp-url-shortener-will-is-coding.c9users.io";
var url = require('url');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	var links = [];
	var validUrl = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]+-?)*[a-z0-9]+)(?:\.(?:[a-z0-9]+-?)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})))(?::\d{2,5})?(?:\/[^\$s]*)?/;
	var invalidError = { "error": "invalid URL" };
	function link() { this.original_url = null; this.short_url = null }
	
	function checkLink( link ) {
		for( var i = 0; i < links.length; i++ ) {
			if( link === links[i].original_url || link === links[i].short_url )
				return links[i];
		}
		return -1;
	}
	function createLink( original ) {
		var newLink = new link();
		newLink.original_url = original;
		links.push(newLink);
		newLink.short_url = myURL + "/" + (links.length - 1).toString();
		return newLink;
	}
	
	app.route('/:short')
		.get ( function(req, res) {
			var short_url = req.params.short;
			if( short_url < links.length ) {
				if( validUrl.test(links[short_url].original_url) )
					res.redirect(links[short_url].original_url);
				else
					res.send(JSON.stringify(invalidError));
			}
			else {
				/*var aLink = checkLink(short_url); //If is original link that was already input
				if( aLink !== -1 )
					res.send( JSON.stringify(aLink) );
				else*/
				res.send(JSON.stringify({"error": "No short_url found for given input"}));
			}
		});
		
	app.route('/new/*')
		.get( function (req, res) {
			var allowInvalid = false;
			var toShorten = req.originalUrl.substring(5); //Removes '/new/'
		
			if( (toShorten.substring(0, 7) !== "http://" || toShorten.substring(0, 8) !== "https://") && validUrl.test(toShorten) )
				toShorten = "http://" + toShorten;
				
			var parsedUrl = url.parse(toShorten);

			if( parsedUrl.query !== null ) {
				allowInvalid = parsedUrl.query.toLowerCase() === "allow=true" ? true : false;
				toShorten = toShorten.substring(0, toShorten.length - 11); //Remove 'allow=true'
			}
			
			if( validUrl.test(toShorten) && !allowInvalid ) {
				var containedLinks = checkLink(toShorten);
				if( containedLinks.original_url === toShorten ) {
					res.send( JSON.stringify(containedLinks) );
				}
				else {
					res.send( JSON.stringify( createLink(toShorten) ) );
				}
			}
			else if( allowInvalid ) {
				res.send( JSON.stringify( createLink(toShorten) ) );
			}
			else if( !validUrl.test(toShorten) && !allowInvalid )
				res.send( JSON.stringify(invalidError) );
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
