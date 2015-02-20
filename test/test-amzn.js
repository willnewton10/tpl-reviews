var amzn = require('../core/amzn');
var fs = require('fs');
var assert = require('assert');

var directory = "test/data";
var html_file = 'amzn.html';
var json_file = 'amzn.json';

var html_text = fs.readFileSync(directory + '/' + html_file, 'utf-8');
var json_text = fs.readFileSync(directory + '/' + json_file, 'utf-8');

var compare = function (b1, b2) { 
    return b1.title < b2.title ? -1 : 1; 
};

var json = JSON.parse(json_text);
json.sort(compare);

describe('amzn', function(){
  describe('#parse()', function(){
    it('should return a list of books when given html from Amazon book search', function(){
	var books = amzn.parse(html_text);
	books.sort(compare);
	assert.deepEqual(books, json);
    });
  });
});

