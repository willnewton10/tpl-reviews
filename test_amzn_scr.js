

/* see if readReviews gets review data from Amazon's html' */

var readReviews = require('./read_amzn_reviews');
var fs = require('fs');
var assert = require('assert');

var directory = "test_data";
var html_file = 'amzn_html_test_data.html';
var json_file = 'test_readReviews_expected.json';
var html_text = fs.readFileSync(directory + '/' + html_file, 'utf-8');
var json_text = fs.readFileSync(directory + '/' + json_file, 'utf-8');

var reviews = readReviews(html_text);
var json = JSON.parse(json_text);

var compare = function (b1, b2) {
    return b1.title < b2.title ? -1 : 1;
};

reviews = reviews.sort(compare);
json = json.sort(compare);

assert.deepEqual(reviews,json);
