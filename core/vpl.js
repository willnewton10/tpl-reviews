
var request = require('request');
var qs      = require('querystring');
var cheerio = require('cheerio');

var baseurl = "http://vpl.bibliocommons.com";

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
	
	if (book.link[0] == "/")
	    book.link = book.link.slice(1);
    }
}

exports.url = function (keywords) {
    return baseurl + "/search?" + 
	qs.stringify({
	    q: keywords,
	    t: 'keyword',
	    display_quantity: '25',
	    page: '1',
	    formats: "BK|LPRINT",
	    circ: 'CIRC' /* "books I can take out" */
	});
};

exports.parse = function (html) {
    var $ = cheerio.load(html); 
    console.log("vpl parsing...");
    return $('div.listItem.clearfix')
	.map(function (i, div) {
	    var $d = $(div).find('div.clearfix').first();
	    return {
		title:  errWrap(getTitle, $d),
		author: errWrap(getAuthor, $d),
		date:   errWrap(getDate, $d),
		holds:  errWrap(getHolds, $d),
		copies: errWrap(getCopies, $d),
		link:   baseurl + errWrap(getLink, $d),
		image:  errWrap(getImage, $d)
	    };
	}).get();
};

function errWrap(f, $d) {
    try {
	return f($d);
    } catch (e) {
	console.log(JSON.stringify(e,null,4));
	return '';
    }
}

function getTitle ($d) {
    return $d.find('div.info span.title a').attr('title').trim();
}
function getAuthor ($d) {
    return $d.find('span.author').text().replace('.','').trim();
}
function getDate ($d) {
    return $d.find('span.format').text().match(/\d+/)[0];
}
function getHolds ($d) {
    return $d.find('span.label.availability').text().replace(/\s+/g, " ").trim();
}
function getCopies ($d) {
    return $d.find('span.label.availability').text().replace(/\s+/g, " ").trim();
}
function getLink ($d) {
    return $d.find('a.jacketCoverLink').attr('href');
}
function getImage ($d) {
    return $d.find('img.jacketCover').attr('src');
}
