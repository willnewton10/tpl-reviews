
/* see if "readBooks" properly gets book data from TPL's html  */


var readBooks = require('./read_tpl_books');
var fs = require('fs');
var assert = require('assert');



/* test data location */
var directory = "test_data";
var html_file = "tpl_html_test_data.html";
var json_file = "test_readBooks_expected.json";

var html_text = fs.readFileSync(directory + "/" + html_file);
var json_text = fs.readFileSync(directory + "/" + json_file, 'utf-8');
var books = readBooks(html_text);
var json = JSON.parse(json_text);

var compare = function (b1, b2) { 
    return b1.title < b2.title ? -1 : 1; 
};
books = books.sort(compare);
json = json.sort(compare);

assert.deepEqual(books, json);
