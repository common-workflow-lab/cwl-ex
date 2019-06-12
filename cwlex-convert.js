const antlr4 = require('antlr4/index');
const cwlexLexer = require('./cwlexLexer');
const cwlexParser = require('./cwlexParser');
const cwlexListener = require('./cwlexListener').cwlexListener;

CwlExListener = function() {
    this.graph = {};
    cwlexListener.call(this); // inherit default listener
    return this;
};

// inherit default listener
CwlExListener.prototype = Object.create(cwlexListener.prototype);
CwlExListener.prototype.constructor = CwlExListener;

// override default listener behavior
CwlExListener.prototype.enterTooldecl = function(ctx) {
    var tool = {
        "class": "CommandLineTool",
        inputs: [],
        outputs: []
    };
    ctx.input_params().param_list().param_decl().map((ip) => {
        tool.inputs.push({"name": ip.name().getText(),
                     "type": ip.typedecl().getText()});
    });
    ctx.output_params().param_list().param_decl().map((ip) => {
        tool.outputs.push({"name": ip.name().getText(),
                     "type": ip.typedecl().getText()});
    });
    this.graph[ctx.name().getText()] = tool;
};

var convert = (input) => {
  var chars = new antlr4.InputStream(input);
  var lexer = new cwlexLexer.cwlexLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new cwlexParser.cwlexParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.root();
  var myls = new CwlExListener();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(myls, tree);
  return myls.graph;
};

exports.convert = convert;
