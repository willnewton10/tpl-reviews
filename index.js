
var request   = require('request');
var readBooks = require('./read_tpl_books');
var qs        = require('querystring');

function buildURL (keywords) {
    var querystring = { N: '37751 37918', /* search Real Books */
			No: '0',          /* paging            */
			Ntt: keywords,
			Erp: '100'        /* results per page  */
		      };
    var baseurl = "http://www.torontopubliclibrary.ca/search.jsp?";
    var encodedURL = baseurl + qs.encode(querystring);
    console.log("Encoded URL: " + encodedURL);
    return encodedURL;
}

module.exports = function searchTPL (keywords, callback) {
    try {
	var url = buildURL(keywords);
	request(url, function (err, response, html) {
	    if (err) callback(err);
	    var books = readBooks(html);
	    callback(null, books);
	});
    } catch (e) {
	callback(e);
    }
};


