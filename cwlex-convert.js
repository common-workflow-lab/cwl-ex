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

CwlExListener.prototype.top = function() {
    return this.current[this.current.length-1];
};

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
    this.current.push({tool: wf, notes: {outputs: {}}});
};

CwlExListener.prototype.exitWorkflowdecl = function(ctx) {
    var wf = this.current.pop();
    this.graph[wf.id] = wf;
};

CwlExListener.prototype.enterWorkflowbody = function(ctx) {
    var top = this.top().tool;
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
        outputs: [],
        requirements: {
            "InlineJavascriptRequirement": {}
        }
    };
    ctx.input_params().param_list().param_decl().map((ip) => {
        tool.inputs[ip.name().getText()] = {"type": ip.typedecl().getText()};
    });

    this.current.push({tool: tool, notes: {outputs: {}}});
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
    var top = this.top().tool;
    var notes = this.top().notes;
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

    top["arguments"] = [];
    ctx.command().argument().map((arg) => {
        top["arguments"].push(arg.getText());
    });

    ctx.output_assignment().map((oa) => {
        var out = {name: oa.assignment().symbol().getText()};
        top.outputs[out.name] = out;

        var ob = {};
        out["outputBinding"] = ob;
        out.type = oa.assignment().subst().typedecl().getText();

        if (oa.assignment().subst().jsexpr()) {
            expr = "$"+oa.assignment().subst().jsexpr().getText();
        } else {
            expr = "$"+oa.assignment().subst().jsblock().getText();
        }
        if (out.type == "File" || out.type == "Directory" ||
            out.type == "File[]" || out.type == "Directory[]") {
            ob["glob"] = expr;
        } else {
            ob["outputEval"] = expr;
        }
    });
}

CwlExListener.prototype.exitTooldecl = function(ctx) {
    var tool = this.current.pop().tool;
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

    var r;
    var values = Object.values(myls.graph);
    if (values.length == 1) {
        r = values[0];
    } else {
        r = {"$graph": values};
    }
    r["cwlVersion"] = "v1.0";
    return r;
};

exports.convert = convert;
