
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

function url (keywords) {
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

    var reviews = [];
    var records = $('li.s-result-item').each(function (i, ul) {
	var $u = $(ul);
	var review = {
	    title:      errWrap(getTitle, $u),
	    stars:      errWrap(getStars, $u),
	    authors:    errWrap(getAuthors, $u),
	    numReviews: errWrap(getNumReviews, $u),
	    link:       errWrap(getLink, $u),
	    image:      errWrap(getImage, $u)
	};
	if (isSubstantial(review)) { reviews.push(review); }
    });
    return reviews;
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
    return $u.find('a.s-access-detail-page').first().attr('title');
}
function getLink ($u) {
    var link = $u.find('a.s-access-detail-page').first().attr('href');
    link = link.match(/.*amazon\.com\/[^\/]+\/[^\/]+\/[^\/]+/g);
    if (link && link.length > 0) return link[0];
    return '';
}

function getAuthors ($u) {
    var authors = [];
    $u.find('div.a-row div.a-spacing-none')
	.first()
	.find('span.a-size-small')
	.slice(1)
	.each(function (i, auth_span) {
	    authors.push( $(auth_span).text() );
	});
    authors = authors.map(function (auth) {
	return auth.replace(' and ', '');
    });
    return authors;
}

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
