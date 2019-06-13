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

CwlExListener.prototype.workTop = function(s) {
    return this.current[s][this.current[s].length-1];
};

CwlExListener.prototype.pushWork = function(s, n) {
    if (!this.current[s]) {
        this.current[s] = [];
    }
    return this.current[s].push(n);
};

CwlExListener.prototype.popWork = function(s) {
    return this.current[s].pop();
};

CwlExListener.prototype.enterWorkflowdecl = function(ctx) {
    var wf = {
        "class": "Workflow",
        "id": ctx.name().getText(),
        inputs: [],
        outputs: []
    };

    this.pushWork("tool", wf);
    this.pushWork("add_fields_to", wf.inputs);
};

CwlExListener.prototype.enterParam_decl = function(ctx) {
    var field = {"name": ctx.name().getText()};
    this.workTop("add_fields_to").push(field);
    this.pushWork("set_type_on", field);
};

CwlExListener.prototype.exitParam_decl = function(ctx) {
    var tp = this.popWork("set_type_on");
    if (ctx.QUES()) {
        tp.type = ["null", tp.type];
    }
};

CwlExListener.prototype.enterTypedecl = function(ctx) {
    if (ctx.symbol()) {
        this.pushWork("field_type", ctx.symbol().getText());
    }
    if (ctx.FILE()) {
        this.pushWork("field_type", ctx.FILE().getText());
    }
    if (ctx.DIRECTORY()) {
        this.pushWork("field_type", ctx.DIRECTORY().getText());
    }
};

CwlExListener.prototype.enterStructdecl = function(ctx) {
    var type = {type: "record", fields: []};
    this.pushWork("field_type", type);
    this.pushWork("add_fields_to", type.fields);
};

CwlExListener.prototype.exitStructdecl = function(ctx) {
    this.popWork("add_fields_to");
};

CwlExListener.prototype.exitTypedecl = function(ctx) {
    var ft = this.popWork("field_type");
    if (ctx.OPENBRACKET()) {
        ft = {"type": "array", "items": ft};
    }
    this.workTop("set_type_on").type = ft;
};

CwlExListener.prototype.exitWorkflowdecl = function(ctx) {
    var wf = this.popWork("tool");
    this.graph[wf.id] = wf;
};

CwlExListener.prototype.enterWorkflowbody = function(ctx) {
    var top = this.workTop("tool");
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
    //ctx.input_params().param_list().param_decl().map((ip) => {
    //    tool.inputs[ip.name().getText()] = {"type": ip.typedecl().getText()};
    //});

    this.pushWork("tool", tool);
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
    var tool = this.popWork("tool");
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
