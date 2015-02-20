
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
    return "http://www.amazon.com/s?" +
	qs.stringify({ 
	    rh: 'n:283155,' +  /* probably means: search in Books */
	        'k:'+keywords.trim(),
	    page: 1
	});
}

var $;

exports.parse = function (html) {
    $ = cheerio.load(html);

    return $('li.s-result-item')
	.map(function (i, ul) {
	    var $u = $(ul);
	    return {
		title:      errWrap(getTitle, $u),
		stars:      errWrap(getStars, $u),
		authors:    errWrap(getAuthors, $u),
		numReviews: errWrap(getNumReviews, $u),
		link:       errWrap(getLink, $u),
		image:      errWrap(getImage, $u)
	    };
	})
	.get()
	.filter(isSubstantial);
};

function isSubstantial(review) {
    return review.link != null && review.hasOwnProperty('title');
}

function errWrap (f, $u) {
    try {
	return f($u);
    } catch (e) {
	console.log(e);
	return null;
    }
}
function getImage($u) {
    return $u
	.find('div.s-item-container ' +
	      'div.a-fixed-left-grid ' +
	      'div.a-fixed-left-grid-inner '+
	      'div.a-fixed-left-grid-col.a-col-left ' +
	      'div.a-row ' +
	      'div.a-column ' +
	      'a.a-link-normal ' +
	      'img.s-access-image').attr('src');
}

function getStars ($u) {
    try {
	var reviewText =  $u
	    .text()
	    .match(/\d(\.\d)? out of 5 stars/g);
	/* take number of stars */
	var stars = reviewText[0].match(/\d(\.\d)?/g)[0];
	return parseFloat(stars); 
    } catch (ex) {
	return -1;
    }
}
function getTitle ($u) {
    return $u.find('a.s-access-detail-page')
	.first()
	.attr('title');
}
function getLink ($u) {
    var link = $u.find('a.s-access-detail-page')
	.first()
	.attr('href');
    link = link.match(/.*amazon\.com\/[^\/]+\/[^\/]+\/[^\/]+/g);
    if (link && link.length > 0) return link[0];
    return '';
}

function getAuthors ($u) {
    return $u.find('div.a-row div.a-spacing-none')
	.first()
	.find('span.a-size-small')
	.slice(1)
	.map(function (i, auth_span) {
	    return $(auth_span).text().replace(' and ', '');
	})
	.get();
};

function getNumReviews ($u) {
    var nr = $u
	.find('div.a-row ' + 
	      'div.a-column.a-span5.a-span-last ' +
	      'div.a-row.a-spacing-mini ' +
	      'a.a-size-small.a-link-normal.a-text-normal')
	.first()
	.text();
    return parseInt(nr.replace(',',''));
}
