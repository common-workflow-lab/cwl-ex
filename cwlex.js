#!/usr/bin/env node
'use strict';
const cwlexConverter = require('./cwlex-convert');
var stringify = require('json-stable-stringify');

var fs = require('fs');

var infile = process.argv[2];
if (infile[0] != "/") {
    infile = process.cwd() +"/"+infile;
}

var input = fs.readFileSync(infile, 'utf8');

var graph = cwlexConverter.convert(input, infile);

console.log("#!/usr/bin/env cwl-runner");
console.log(stringify(graph, { space: 2 }));
