const antlr4 = require('antlr4/index');
const cwl2Lexer = require('./cwl2Lexer');
const cwl2Parser = require('./cwl2Parser');
const cwl2Listener = require('./cwl2Listener').cwl2Listener;

MyListener = function() {
    cwl2Listener.call(this); // inherit default listener
    return this;
};

// inherit default listener
MyListener.prototype = Object.create(cwl2Listener.prototype);
MyListener.prototype.constructor = MyListener;

// override default listener behavior
MyListener.prototype.enterName = function(ctx) {
    console.log("name "+ctx.getText());
};

var fs = require('fs');

var input = fs.readFileSync('cwlsm', 'utf8');

var chars = new antlr4.InputStream(input);
var lexer = new cwl2Lexer.cwl2Lexer(chars);
var tokens  = new antlr4.CommonTokenStream(lexer);
var parser = new cwl2Parser.cwl2Parser(tokens);
parser.buildParseTrees = true;
var tree = parser.root();
var myls = new MyListener();
antlr4.tree.ParseTreeWalker.DEFAULT.walk(myls, tree);
