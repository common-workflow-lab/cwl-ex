const antlr4 = require('antlr4/index');
const cwlexLexer = require('./cwlexLexer');
const cwlexParser = require('./cwlexParser');
const cwlexListener = require('./cwlexListener').cwlexListener;

CwlExListener = function() {
    this.graph = {};
    this.current = [];
    cwlexListener.call(this); // inherit default listener
    return this;
};

// inherit default listener
CwlExListener.prototype = Object.create(cwlexListener.prototype);
CwlExListener.prototype.constructor = CwlExListener;

CwlExListener.prototype.enterWorkflowdecl = function(ctx) {
    var wf = {
        "class": "Workflow",
        "id": ctx.name().getText(),
        inputs: [],
        outputs: []
    };
    ctx.input_params().param_list().param_decl().map((ip) => {
        wf.inputs.push({"name": ip.name().getText(),
                     "type": ip.typedecl().getText()});
    });
    ctx.output_params().param_list().param_decl().map((ip) => {
        wf.outputs.push({"name": ip.name().getText(),
                     "type": ip.typedecl().getText()});
    });
    this.current.push(wf);
};

CwlExListener.prototype.exitWorkflowdecl = function(ctx) {
    var wf = this.current.pop();
    this.graph[wf.id] = wf;
};

CwlExListener.prototype.enterWorkflowbody = function(ctx) {
    var top = this.current[this.current.length-1];
    ctx.workflowbodyStatement().map((stmt) => {
        if (stmt.assignment()) {

        }
    });
}

CwlExListener.prototype.enterTooldecl = function(ctx) {
    var tool = {
        "class": "CommandLineTool",
        "id": ctx.name().getText(),
        inputs: {},
        outputs: {}
    };
    ctx.input_params().param_list().param_decl().map((ip) => {
        tool.inputs[ip.name().getText()] = {"type": ip.typedecl().getText()};
    });
    ctx.output_params().param_list().param_decl().map((ip) => {
        tool.outputs[ip.name().getText()] = {"type": ip.typedecl().getText()};
    });
    this.current.push(tool);
};

extractString = (ctx) => {
    var txt;
    if (ctx.SQSTRING()) {
        txt = ctx.SQSTRING().getText();
    }
    if (ctx.DQSTRING()) {
        txt = ctx.DQSTRING().getText();
    }
    return txt.substr(1, txt.length-2);
};

CwlExListener.prototype.enterToolbody = function(ctx) {
    var top = this.current[this.current.length-1];
    ctx.const_assignment().map((ca) => {
        var newinput = top.inputs[ca.name().getText()];
        if (!newinput) {
            newinput = {};
            top.inputs[ca.name().getText()] = newinput;
        }
        if (ca.SQSTRING()) {
            newinput.type = "string";
            newinput["default"] = extractString(ca);
        }
        if (ca.DQSTRING()) {
            newinput.type = "string";
            newinput["default"] = extractString(ca);
        }
        if (ca.INTEGER()) {
            newinput.type = "int";
            newinput["default"] = parseInt(ca.INTEGER().getText());
        }
        if (ca.FLOAT()) {
            newinput.type = "float";
            newinput["default"] = parseFloat(ca.FLOAT().getText());
        }
        if (ca.file_const()) {
            newinput.type = "File";
            newinput["default"] = {
                "class": "File",
                "location": extractString(ca.file_const())
            };
        }
        if (ca.dir_const()) {
            newinput.type = "Directory";
            newinput["default"] = {
                "class": "Directory",
                "location": extractString(ca.file_const())
            };
        }
    });
}

CwlExListener.prototype.exitTooldecl = function(ctx) {
    var tool = this.current.pop();
    this.graph[tool.id] = tool;
}

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
