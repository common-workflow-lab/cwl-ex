#!/usr/bin/env node
'use strict';
const cwlexConverter = require('./cwlex-convert');
const yaml = require('js-yaml');

var fs = require('fs');

var infile = process.argv[2];
if (infile[0] != "/") {
    infile = process.cwd() +"/"+infile;
}

var input = fs.readFileSync(infile, 'utf8');

var graph = cwlexConverter.convert(input, infile);

console.log("#!/usr/bin/env cwl-runner");
console.log(yaml.safeDump(graph, {sortKeys: true}));
