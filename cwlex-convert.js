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
        "requirements": {
            "ScatterFeatureRequirement": {},
            "StepInputExpressionRequirement": {}
        },
        inputs: [],
        outputs: [],
        steps: [],
    };

    this.pushWork("tool", wf);
    this.pushWork("add_fields_to", wf.inputs);
    this.pushWork("namefield", "id");
    this.pushWork("bindings", {});
};

CwlExListener.prototype.enterParam_decl = function(ctx) {
    var field = {};
    field[this.workTop("namefield")] = ctx.name().getText();
    this.workTop("add_fields_to").push(field);
    this.pushWork("set_type_on", field);
};

CwlExListener.prototype.exitParam_decl = function(ctx) {
    var tp = this.popWork("set_type_on");
    if (ctx.QUES()) {
        tp.type = ["null", tp.type];
    }
    if (this.workTop("namefield") == "id" && this.workTop("tool")["class"] == "Workflow") {
        this.workTop("bindings")[ctx.name().getText()] = {"source": ctx.name().getText(), "type": tp.type};
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
    this.pushWork("namefield", "name");
};

CwlExListener.prototype.exitStructdecl = function(ctx) {
    this.popWork("add_fields_to");
    this.popWork("namefield");
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
    this.popWork("add_fields_to");
    this.popWork("namefield");
    this.popWork("bindings", {});
};

CwlExListener.prototype.enterWorkflowbody = function(ctx) {
    this.pushWork("symbolassign", []);
}
CwlExListener.prototype.exitWorkflowbody = function(ctx) {
    var sa = this.popWork("symbolassign");
    var wf = this.workTop("tool");
    var bind = this.workTop("bindings");
    sa.map((m) => {
        var src = bind[m[1]];
        wf.outputs.push({id: m[0], type: src.type, outputSource: src.source});
    });
}

CwlExListener.prototype.enterTooldecl = function(ctx) {
    var tool = {
        "class": "CommandLineTool",
        "id": ctx.name().getText(),
        inputs: [],
        outputs: [],
        requirements: {
            "InlineJavascriptRequirement": {}
        }
    };

    this.pushWork("tool", tool);
    this.pushWork("add_fields_to", tool.inputs);
    this.pushWork("namefield", "id");
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

CwlExListener.prototype.enterConst_assignment = function(ctx) {
    var top = this.workTop("tool");
    var ca = ctx;

    var newinput = {"id": ctx.name().getText()};
    top.inputs.push(newinput);

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
};

CwlExListener.prototype.exitConst_assignment = function(ctx) {
};

CwlExListener.prototype.enterOutput_assignment = function(ctx) {
    var oa = ctx;
    var out = {"id": oa.assignment().symbol().getText()};
    this.pushWork("set_type_on", out);
    top = this.workTop("tool");
    top.outputs.push(out);

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
};

CwlExListener.prototype.exitOutput_assignment = function(ctx) {
    this.popWork("set_type_on");
}

CwlExListener.prototype.enterCommand = function(ctx) {
    var top = this.workTop("tool");
    top["arguments"] = [];
    ctx.argument().map((arg) => {
        top["arguments"].push(arg.getText());
    });
    if (ctx.redirect()) {
        top["stdout"] = ctx.redirect().argument().getText();
    }
    if (ctx.scriptbody()) {
        top["requirements"].InitialWorkDirRequirement = {
            listing: [{
                entryname: "_script",
                entry: ctx.scriptbody().scriptlines().getText()
            }]};
        top["arguments"].push("_script");
    }
    this.pushWork("pos", 1);
}

CwlExListener.prototype.enterOptional_arg = function(ctx) {
    var pos = this.popWork("pos");
    this.pushWork("pos", pos+1);
    var tool = this.workTop("tool");
    tool.inputs.map((inp) => {
        if (inp.id == ctx.symbol().getText()) {
            inp.inputBinding = {};
            inp.inputBinding.prefix = ctx.argument().getText();
            inp.inputBinding.position = pos;
        }
    });
};

CwlExListener.prototype.exitCommand = function(ctx) {
    this.popWork("pos");
};

CwlExListener.prototype.exitTooldecl = function(ctx) {
    var tool = this.popWork("tool");
    this.graph[tool.id] = tool;
    this.popWork("namefield");
}

CwlExListener.prototype.enterStep = function(ctx) {
    this.pushWork("symbolassign", []);
    var step = {"in": {}, "out": []};
    this.pushWork("step", step);
};

CwlExListener.prototype.enterSymbolassign = function(ctx) {
    if (ctx.symbol()) {
        this.workTop("symbolassign").push([ctx.name().getText(), ctx.symbol().getText()]);
    } else {
        this.workTop("symbolassign").push([ctx.name().getText(), ctx.name().getText()]);
    }
};

CwlExListener.prototype.exitStep = function(ctx) {
    var sa = this.popWork("symbolassign");
    var step = this.popWork("step");
    sa.map((m) => {
        step.out.push(m[1]);

        var tp;
        this.workTop("embedded")["outputs"].map((op) => {
            if (op["id"] == [m[1]]) {
                tp = op["type"];
            }
        });
        if (step["scatter"]) {
            tp = {type: "array", items: tp};
        }

        this.workTop("bindings")[m[0]] = {"source": step.id+"/"+m[1], "type": tp};
    });
    this.workTop("tool").steps.push(step);
};

CwlExListener.prototype.enterCall = function(ctx) {
    this.workTop("step")["id"] = ctx.symbol().getText();
    this.workTop("step")["run"] = "#"+ctx.symbol().getText();
    this.pushWork("embedded", this.graph[ctx.symbol().getText()]);
};

CwlExListener.prototype.exitCall = function(ctx) {
}

CwlExListener.prototype.enterForeach = function(ctx) {
    var inp = ctx.scatterparams().symbollist().symbol().map((p) => p.getText());
    var src = ctx.scattersources().symbollist().symbol().map((p) => p.getText());
    this.workTop("step").scatter = inp;
    for (var i = 0; i < inp.length; i++) {
        if (!this.workTop("step")["in"][inp[i]]) {
            this.workTop("step")["in"][inp[i]] = {};
        }
        this.workTop("step")["in"][inp[i]]["source"] = src[i];
    }
}

CwlExListener.prototype.enterStepinput = function(ctx) {
    var workin = this.workTop("step")["in"];
    var link = {};
    if (ctx.symbol()) {
        link["source"] = ctx.symbol().getText();
    }
    if (ctx.SQSTRING()) {
        link["default"] = extractString(ctx);
    }
    if (ctx.DQSTRING()) {
        link["default"] = extractString(ctx);
    }
    if (ctx.INTEGER()) {
        link["default"] = parseInt(ctx.INTEGER().getText());
    }
    if (ctx.FLOAT()) {
        link["float"] = parseInt(ctx.FLOAT().getText());
    }
    if (ctx.jsexpr()) {
        link["valueFrom"] = '$'+ctx.jsexpr().getText();
    }
    workin[ctx.name().getText()] = link;
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
