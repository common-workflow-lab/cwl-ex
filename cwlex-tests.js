const cwlexConverter = require('./cwlex-convert');
var fs = require('fs');

var test = (infile, compare) => {
    var input = fs.readFileSync(infile, 'utf8');
    var graph = cwlexConverter.convert(input);
    var converted = JSON.stringify(graph, null, 2)+"\n";
    var comparetext = fs.readFileSync(compare, 'utf8');
    if (converted != comparetext) {
        console.log(infile + " does not match expected "+compare);
        console.log(converted.length);
        console.log(comparetext.length);
    }
};

var cases = [["tests/antlr/antlr.cwlex", "tests/antlr/antlr.cwl"],
             ["tests/site/cwlsite.cwlex", "tests/site/cwlsite.cwl"]];
cases.map((c) => test(c[0], c[1]));