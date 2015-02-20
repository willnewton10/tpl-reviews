var cheerio = require('cheerio');

module.exports = function readBooks (html) {
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
