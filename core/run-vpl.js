var html = require('fs').readFileSync("test/data/vpl.html",'utf-8');
var vpl = require('../core/vpl');
var x = vpl.parse(html);

console.log(JSON.stringify(x, null, 4));
