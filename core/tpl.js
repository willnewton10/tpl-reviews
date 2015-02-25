
var request = require('request');
var qs      = require('querystring');
var cheerio = require('cheerio');

var baseurl = "http://www.torontopubliclibrary.ca";

exports.search = function (keywords, callback) {
    try {
	var url = exports.url(keywords);
	request(url, function (err, response, html) {
	    if (err) callback(err);
	    var books = exports.parse(html);
	    fixUp(books);
	    callback(null, books);
	});
    } catch (e) {
	callback(e);
    }
};

function fixUp(books) {
    for (var b in books) {
	var book = books[b];

	if (book.link[0] != "/")
	    book.link = "/" + book.link;
	if (book.link.indexOf("www.torontopubliclibrary.ca") == -1) {
	    book.link = "http://www.torontopubliclibrary.ca" + book.link;
	}
    }
}

exports.url = function (keywords) {
    return baseurl + "/search.jsp?" + 
	qs.stringify({
	    N: '37751 37918', /* search Real Books */
	    No: '0',          /* paging            */
	    Ntt: keywords.trim(),
	    Erp: '20'         /* results per page  */
	});
};

exports.parse = function (html) {
    var $ = cheerio.load(html); 
    console.log("tpl parsing...");
    return $('div.record-result')
	.map(function (i, div) {
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
    var author = $d.find('span.author')
	.text()
	.replace('.','');
    if (author == null) 
	return '';

    var matches = author.match(/(\w|-)+, (\w| |\.|-)+/g);
    if (matches == null || matches.length == 0) 
	return '';

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
    return $d
	.find('div.image-container.grid_2.alpha ' +
	      'a ' + 
	      'img.image._simple')
	.attr('src');
}

function get1stNum (str) {
    if (! str) return -1;
    var results = str.match(/\d+/);
    if (results.length > 0) return parseInt(results[0]);
    return -1;
}
