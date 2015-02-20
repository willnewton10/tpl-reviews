
var request = require('request');
var qs      = require('querystring');
var cheerio = require('cheerio');

exports.search = function (keywords, callback) {
    try {
	var url = exports.url(keywords);
	request(url, function (err, response, html) {
	    if (err) callback(err);
	    var books = exports.parse(html);
	    callback(null, books);
	});
    } catch (e) {
	callback(e);
    }
};

exports.url = function (keywords) {
    return "http://www.torontopubliclibrary.ca/search.jsp?" + 
	qs.stringify({
	    N: '37751 37918', /* search Real Books */
	    No: '0',          /* paging            */
	    Ntt: keywords,
	    Erp: '100'        /* results per page  */
	});
};

exports.parse = function (html) {
    var $ = cheerio.load(html); 

    var books = [];
    var records = $('div.record-result').each(function (i, div) {
	var find = function (_class) {
	    var text = $(div).find('span.'+_class).text();
	    return (text || "").trim();
	};
	var book = {
	    title:  find('notranslate'),
	    author: tryGetAuthor(find('author')).replace('.',''),
	    date:   find('date').replace('.',''),
	    holds:  get1stNum(find('holds')),
	    copies: get1stNum(find('copies')),
	    link: $(div).find('div.title a').first().attr('href'),
	    image: $(div)
		.find('div.image-container.grid_2.alpha ' +
		      'a ' + 
		      'img.image._simple')
		.attr('src')
	};
	books.push(book);
    });    
    return books;
};

function get1stNum (str) {
    var results = str.match(/\d+/);
    if (results.length > 0) return parseInt(results[0]);
    return -1;
}

function tryGetAuthor(str) {
    if (str == null) return '';
    var results = str.match(/(\w|-)+, (\w| |\.|-)+/g);
    if (results == null) return '';
    if (results.length > 0)
	return results[0];
    return "";
}
