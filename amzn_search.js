
var request =   require('request');
var readReviews = require('./read_amzn_reviews');
var qs =        require('querystring');

function buildURL (keywords) {
    var url = "http://www.amazon.com/s?" +
	qs.stringify({ 
	    rh: 'n:283155,' +  /* probably means: search in Books */
	    'k:'+keywords.trim(),
	    page: 1
	});
    return url;
}

module.exports = function searchReviews (keywords, callback) {
    try {
	var url = buildURL(keywords);
	request(url, function (err, response, html) {
	    if (err) callback(err);
	    var books = readReviews(html);
	    callback(null, books);
	});	
    } catch (e) {
	callback(e);
    }
};
