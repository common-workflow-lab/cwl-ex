#!/usr/bin/env node
'use strict';
const cwlexConverter = require('./cwlex-convert');
var stringify = require('json-stable-stringify');

var fs = require('fs');

var input = fs.readFileSync(process.argv[2], 'utf8');

var graph = cwlexConverter.convert(input);

console.log(stringify(graph, { space: 2 }));
