
var request = require('request');
var qs      = require('querystring');
var cheerio = require('cheerio');

var baseurl = "http://www.torontopubliclibrary.ca";

exports.search = function (querystring, callback) {
    try {
		var url = exports.url(querystring);
		console.log("requesting TPL URL: " + url);
		request(url, function (err, response, html) {
			if (err) {
				callback(err);
			}
			var books = exports.parse(html);
			fixUp(books);
			callback(null, books);
		});
    } catch (e) {
		console.log(e);
    }
};

function fixUp(books) {
    for (var b in books) {
		var book = books[b];

		if (book.link[0] != "/") {
			book.link = "/" + book.link;
		}
		if (book.link.indexOf("www.torontopubliclibrary.ca") == -1) {
			book.link = "http://www.torontopubliclibrary.ca" + book.link;
		}
    }
}

exports.url = function (incomingRequestQuerystring) {
	var params = {
	    No: '0',          /* paging            */
	    Ntt: incomingRequestQuerystring.keywords.trim(),
	    Erp: '20'         /* results per page  */
	};
	var BORROW_AND_TAKE_HOME = '37751';
	var REGULAR_PRINT_BOOKS = '37918';
	var EBOOKS = '38574';
	var typesOfBooks = [BORROW_AND_TAKE_HOME]
	var ebooks = incomingRequestQuerystring.ebooks == '1';
	typesOfBooks.push(ebooks ? EBOOKS: REGULAR_PRINT_BOOKS);
	params.N = typesOfBooks.join(" ");
    return baseurl + "/search.jsp?" +  qs.stringify(params);
};

exports.parse = function (html) {
    var $ = cheerio.load(html); 
    console.log("tpl parsing...");
    return $('div.record-result').map(function (i, div) {
		var $d = $(div);
		return {
			title:  getTitle($d),
			author: getAuthor($d),
			date:   getDate($d),
			holds:  getHolds($d),
			copies: getCopies($d),
			link:   getLink($d),
			image:  getImage($d)
		};
	}).get();    
};

function getTitle ($d) {
    return $d.find('span.notranslate').text();
}
function getAuthor ($d) {
    var author = $d.find('span.author').text().replace('.','');
    if (author == null) {
		return '';
	}

    var matches = author.match(/(\w|-)+, (\w| |\.|-)+/g);
    if (matches == null || matches.length == 0) {
		return '';
	}
    return matches[0];
}
function getDate ($d) {
    return $d.find('span.date').text().replace('.','');
}
function getHolds ($d) {
    return get1stNum($d.find('span.holds').text());
}
function getCopies ($d) {
    return get1stNum($d.find('span.copies').text());
}
function getLink ($d) {
    return $d.find('div.title a').first().attr('href');
}
function getImage ($d) {
	return $d.find('div.image-container a img.image._simple').attr('src');
}

function get1stNum (str) {
    if (! str) {
		return -1;
	}
    var results = str.match(/\d+/);
    if (results.length > 0) {
		return parseInt(results[0]);
	}
    return -1;
}
