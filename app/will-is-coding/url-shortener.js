'use strict';
var url = require('url');

var myURL = "https://freecodecamp-url-shortener-will-is-coding.c9users.io";

//Copyright (c) 2010-2013 Diego Perini
//https://gist.github.com/dperini/729294#file-regex-weburl-js
var validUrl = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      // TLD may end with dot
      "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
  "$", "i"
);

function link() { this.original_url = null; this.short_url = null }
var links = [];

function createLink( original ) {
	var newLink = new link();
	newLink.original_url = original;
	links.push(newLink);
	newLink.short_url = myURL + "/" + (links.length - 1).toString();
	return newLink;
}
createLink("http://freecodecamp.com");

module.exports = {
    fetch_short_url: function(shortened) {
        if( !Number.isNaN(Number(shortened)) && Number(shortened) < links.length ) {
            if( validUrl.test(links[Number(shortened)].original_url) )
                return { retrieved: links[Number(shortened)].original_url, valid: true };
            else
                return { error: "Invalid URL", valid: false };
        }
        else {
            for( var i = 0; i < links.length; i++ ) {
                if( link === links[i].original_url || link === links[i].short_url )
                    return { retrieved: links[i], valid: true };
            }
            return { error: "No short_url found for given input", valid: false };
        }
    },
    
    shortern_url: function(original, allowInvalid) {
        var toShorten = original.substring(5); // Removes '/new/'

        if( (toShorten.substring(0, 7) !== "http://" && toShorten.substring(0, 8) !== "https://") && validUrl.test(toShorten) ) {
		
			toShorten = "http://" + toShorten;
        }
				
		var parsedUrl = url.parse(toShorten);

		if( parsedUrl.query !== null ) {
			allowInvalid = parsedUrl.query.toLowerCase() === "allow=true" ? true : false;
			toShorten = toShorten.substring(0, toShorten.length - 11); //Remove 'allow=true'
		}
		
		if( validUrl.test(toShorten) && !allowInvalid ) {
		    
			for( var i = 0; i < links.length; i++ ) {
		        if( toShorten === links[i].original_url )
		            return { retrieved: links[i] };
			}
			
			return { retrieved: createLink(toShorten) };
		}
		else if( allowInvalid )
			return { retrieved: createLink(toShorten) };
		
		else if( !validUrl.test(toShorten) && !allowInvalid )
		    return { error: "Invalid URL" };
    }
};