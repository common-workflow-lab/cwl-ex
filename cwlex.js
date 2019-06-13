const cwlexConverter = require('./cwlex-convert');

var fs = require('fs');

var input = fs.readFileSync(process.argv[2], 'utf8');

var graph = cwlexConverter.convert(input);

console.log(JSON.stringify(graph, null, 2));
