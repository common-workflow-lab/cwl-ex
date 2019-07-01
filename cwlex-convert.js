'use strict';
const antlr4 = require('antlr4/index');
const cwlexLexer = require('./cwlexLexer');
const cwlexParser = require('./cwlexParser');
const cwlexListener = require('./cwlexListener').cwlexListener;

var CwlExListener = function(baseurl) {
    this.graph = {};
    this.current = [];
    this.baseurl = baseurl;
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
            "StepInputExpressionRequirement": {},
            "MultipleInputFeatureRequirement": {},
            "InlineJavascriptRequirement": {},
            "SubworkflowFeatureRequirement": {}
        },
        inputs: [],
        outputs: [],
        steps: [],
    };

    this.pushWork("tool", wf);
    this.pushWork("add_fields_to", wf.inputs);
    this.pushWork("namefield", "id");
    this.pushWork("bindings", {});
    this.pushWork("stepcount", 0);
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
    if (ctx.const_value()) {
        var cv = this.popWork("const_value");
        tp.type = cv.type;
        tp["default"] = cv["default"];
    }
    if (this.workTop("namefield") == "id" && this.workTop("tool")["class"] == "Workflow") {
        this.workTop("bindings")[ctx.name().getText()] = {"source": ctx.name().getText(), "type": tp.type};
    }
};

CwlExListener.prototype.enterTypedecl = function(ctx) {
    if (ctx.typekeyword()) {
        this.pushWork("field_type", ctx.typekeyword().getText());
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
    this.pushWork("bindings", {});
};

var extractString = (ctx) => {
    var txt = ctx.getText();
    if (ctx.SQSTRING && ctx.SQSTRING()) {
        txt = ctx.SQSTRING().getText();
    }
    if (ctx.DQSTRING && ctx.DQSTRING()) {
        txt = ctx.DQSTRING().getText();
    }
    var ret = "";
    var curq = "";
    for (var i = 0; i < txt.length; i++) {
        if ((txt[i] == '"' || txt[i] == "'") && curq == "") {
            curq = txt[i];
            continue;
        }
        if (txt[i] == curq) {
            curq = "";
            continue;
        }
        if (txt[i] == "\\") {
            ret += txt[i+1];
            i += 1;
            continue;
        }
        ret += txt[i];
    }
    return ret;
};

CwlExListener.prototype.enterConst_value = function(ctx) {
    var ca = ctx;
    var newinput = {};
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
    if (ca.struct_const()) {
        // gets set in enterStruct_const
        return;
    }
    if (ca.list_const()) {
        newinput.type = "Any";
        newinput["default"] = [];
    }
    this.pushWork("const_value", newinput);
};

CwlExListener.prototype.enterStruct_const = function(ctx) {
    var newinput = {};
    newinput.type = "Any";
    newinput["default"] = {};
    this.pushWork("const_value", newinput);
};

CwlExListener.prototype.exitStruct_field = function(ctx) {
    var inner = this.popWork("const_value");
    var outer = this.workTop("const_value");
    outer["default"][extractString(ctx.struct_field_name())] = inner["default"];
};

CwlExListener.prototype.exitList_entry = function(ctx) {
    var inner = this.popWork("const_value");
    var outer = this.workTop("const_value");
    outer["default"].push(inner["default"]);
};

CwlExListener.prototype.exitConst_assignment = function(ctx) {
    var top = this.workTop("tool");
    var ca = ctx;

    var newinput = this.popWork("const_value");
    newinput["id"] = ctx.name().getText();
    top.inputs.push(newinput);

    this.workTop("bindings")[newinput.id] = {source: newinput.id, type: newinput.type};
};

CwlExListener.prototype.enterOutput_assignment = function(ctx) {
    var oa = ctx;
    var top = this.workTop("tool");

    var out;
    for (var i = 0; i < top.outputs.length; i++) {
        if (top.outputs[i].id == oa.name().getText()) {
            out = top.outputs[i];
            break
        }
    }
    if (!out) {
        out = {"id": oa.name().getText()};
        top.outputs.push(out);
    }
    this.pushWork("set_type_on", out);

    var ob = {};
    out["outputBinding"] = ob;
    if (oa.typedexpr()) {
        out.type = oa.typedexpr().typedecl().getText();

        var expr;
        if (oa.typedexpr().jsexpr()) {
            expr = "$"+oa.typedexpr().jsexpr().getText();
        } else {
            expr = "$"+oa.typedexpr().jsblock().getText();
        }
        if (out.type == "File" || out.type == "Directory" ||
            out.type == "File[]" || out.type == "Directory[]") {
            ob["glob"] = expr;
        } else {
            ob["outputEval"] = expr;
        }
    } else {
        top.inputs.map((inp) => {
            if (inp.id == oa.symbol().getText()) {
                out.type = inp.type;
            }
        });
        ob["outputEval"] = "$(inputs." + oa.symbol().getText() + ")";
    }
};

CwlExListener.prototype.exitOutput_assignment = function(ctx) {
    this.popWork("set_type_on");
}

CwlExListener.prototype.enterCommand = function(ctx) {
    var top = this.workTop("tool");
    top["arguments"] = [];
    ctx.argument().map((arg) => {
        top["arguments"].push(extractString(arg));
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
        if (inp.id == ctx.name().getText()) {
            if (!inp.inputBinding) {
                inp.inputBinding = {};
            }
            inp.inputBinding.position = pos;
            if (ctx.FOR()) {
                var setbind = (tp) => {
                    if (tp instanceof Object) {
                        tp.inputBinding = {prefix: ctx.argument().getText()};
                    }
                };
                if (inp.type instanceof Array) {
                    inp.type.map((tp) => setbind(tp));
                } else {
                    setbind(inp.type);
                }
            } else {
                inp.inputBinding.prefix = ctx.argument().getText();
            }
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
    this.popWork("bindings");
}

CwlExListener.prototype.enterStep = function(ctx) {
    this.pushWork("symbolassign", []);
    var step = {"in": {}, "out": []};
    this.pushWork("step", step);
    var stepcount = this.popWork("stepcount");
    this.pushWork("stepcount", stepcount+1);
    if (ctx.exprstep() || ctx.inlinetool() || ctx.inlineworkflow()) {
        this.pushWork("inline", true);
    }
};

CwlExListener.prototype.enterSymbolassignlist = function(ctx) {
    if (ctx.symbol()) {
        this.workTop("symbolassign").push([ctx.symbol().getText(), ctx.symbol().getText()]);
    }
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
    this.popWork("embedded");
    if (ctx.exprstep() || ctx.inlinetool() || ctx.inlineworkflow()) {
        this.popWork("inline");
    }
};

CwlExListener.prototype.enterCall = function(ctx) {
    this.workTop("step")["id"] = ctx.symbol().getText();
    this.workTop("step")["run"] = this.graph[ctx.symbol().getText()]["id"];
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
        var bind = this.workTop("bindings")[ctx.symbol().getText()];
        link.source = bind.source;
        if (this.workTop("inline")) {
            this.workTop("embedded")["inputs"].push({id: ctx.name().getText(), type: bind.type});
        }
    } else if (ctx.SQSTRING()) {
        link["default"] = extractString(ctx);
    } else if (ctx.DQSTRING()) {
        link["default"] = extractString(ctx);
    } else if (ctx.INTEGER()) {
        link["default"] = parseInt(ctx.INTEGER().getText());
    } else if (ctx.FLOAT()) {
        link["float"] = parseInt(ctx.FLOAT().getText());
    } else if (ctx.jsexpr()) {
        link["valueFrom"] = '$'+ctx.jsexpr().getText();
    } else if (ctx.jsblock()) {
        link["valueFrom"] = '$'+ctx.jsblock().getText();
    } else if (ctx.linkmerge()) {
        var items = [];
        if (ctx.linkmerge().MERGE_NESTED()) {
            link.linkMerge = "merge_nested";
            ctx.linkmerge().symbol().map((s) => {
                var t = this.workTop("bindings")[s.getText()].type;
                addUnique(items, t);
            });
        }
        if (ctx.linkmerge().MERGE_FLATTENED()) {
            link.linkMerge = "merge_flattened";
            ctx.linkmerge().symbol().map((s) => {
                var t = this.workTop("bindings")[s.getText()].type;
                if ((t instanceof Object) && t.type == "array") {
                    addUnique(items, t.items);
                } else {
                    addUnique(items, t);
                }
            });
        }
        link.source = ctx.linkmerge().symbol().map((s) => this.workTop("bindings")[s.getText()].source);

        if (this.workTop("inline")) {
            if (items.length == 1) {
                items = items[0];
            }
            this.workTop("embedded").inputs.push({id: ctx.name().getText(),
                                                  type: {"type": "array", "items": items}});
        }
    } else {
        var bind = this.workTop("bindings")[ctx.name().getText()];
        link.source = bind.source;
        if (this.workTop("inline")) {
            this.workTop("embedded")["inputs"].push({id: ctx.name().getText(), type: bind.type});
        }
    }

    workin[ctx.name().getText()] = link;
};

CwlExListener.prototype.enterExprstep = function(ctx) {
    this.workTop("step")["id"] = this.workTop("tool")["id"] + "_" + this.workTop("stepcount");
    var rvar = this.workTop("symbolassign")[0][1];
    var r = {
        "id": rvar
    };
    var tool = {
        "class": "ExpressionTool",
        "inputs": [],
        "outputs": [r]
    };
    this.workTop("step")["run"] = tool;

    if (ctx.typedexpr().jsexpr()) {
        tool.expression = "${return {'"+rvar+"': "+ctx.typedexpr().jsexpr().getText()+"};}";
    }
    if (ctx.typedexpr().jsblock()) {
        tool.expression = "${return {'"+rvar+"': (function()"+ctx.typedexpr().jsblock().getText()+")()};}";
    }

    this.pushWork("tool", tool);
    this.pushWork("namefield", "id");
    this.pushWork("add_fields_to", tool.inputs);
    this.pushWork("set_type_on", r);
    this.pushWork("embedded", tool);
};

CwlExListener.prototype.exitExprstep = function(ctx) {
    this.popWork("tool");
    this.popWork("namefield");
    this.popWork("add_fields_to");
    this.popWork("set_type_on");
};

CwlExListener.prototype.enterInlinetool = function(ctx) {
    this.workTop("step")["id"] = this.workTop("tool")["id"] + "_" + this.workTop("stepcount");
    var tool = {
        "class": "CommandLineTool",
        "inputs": [],
        "outputs": [],
        requirements: {
            "InlineJavascriptRequirement": {}
        }
    };
    this.workTop("step")["run"] = tool;

    this.pushWork("tool", tool);
    this.pushWork("namefield", "id");
    this.pushWork("add_fields_to", tool.inputs);
    this.pushWork("embedded", tool);
};

CwlExListener.prototype.exitInlinetool = function(ctx) {
    this.popWork("tool");
    this.popWork("namefield");
    this.popWork("add_fields_to");
    this.popWork("set_type_on");
};

CwlExListener.prototype.enterInlineworkflow = function(ctx) {
    this.enterInlinetool(ctx);
    this.workTop("tool")["class"] = "Workflow";
    this.workTop("tool")["steps"] = [];
};

CwlExListener.prototype.exitInlineworkflow = function(ctx) {
    this.exitInlinetool(ctx);
};

CwlExListener.prototype.enterInlineworkflowbody = function(ctx) {
    this.pushWork("bindings", {});
    this.pushWork("stepcount", 0);
};

CwlExListener.prototype.exitInlineworkflowbody = function(ctx) {
    this.popWork("bindings");
    this.popWork("stepcount");
};

var addUnique = (items, a) => {
    for (var i = 0; i < items.length; i++) {
        if (items[i] == a) {
            return;
        }
    }
    items.push(a);
};

CwlExListener.prototype.enterSourceassign = function(ctx) {

};

CwlExListener.prototype.exitReq_decl = function(ctx) {
    var reqs = this.workTop("reqs");
    var r = {};
    if (ctx.struct_const()) {
        r = this.popWork("const_value")["default"];
    }
    r["class"] = ctx.symbol().getText();
    reqs.push(r);
}

CwlExListener.prototype.enterReqs = function(ctx) {
    this.pushWork("reqs", []);
}

CwlExListener.prototype.exitReqs = function(ctx) {
    var reqs = this.popWork("reqs");
    if (ctx.REQUIREMENTS()) {
        this.workTop("tool")["requirements"] = reqs;
    }
    if (ctx.HINTS()) {
        this.workTop("tool")["hints"] = reqs;
    }
}

var convert = (input, baseurl) => {
  var chars = new antlr4.InputStream(input);
  var lexer = new cwlexLexer.cwlexLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new cwlexParser.cwlexParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.root();
  var myls = new CwlExListener(baseurl);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(myls, tree);

    var graph = {};
    Object.keys(myls.graph).map((g) => {
        if (!myls.graph[g]["_external"]) {
            graph[g] = myls.graph[g];
        }
    });

    var r;
    var values = Object.values(graph);
    if (values.length == 1) {
        r = values[0];
    } else {
        r = {"$graph": values};
    }
    r["cwlVersion"] = "v1.0";
    return r;
};

exports.convert = convert;

var salad = (graph) => {
    ["inputs", "outputs"].map((k) => {
        var lst = [];
        Object.keys(graph[k]).map((id) => {
            var g = graph[k][id];
            if (typeof(g) === "string") {
                g = {"type": g};
            }
            g["id"] = id;
            lst.push(g);
        })
        graph[k] = lst;
    });
    return graph;
};

CwlExListener.prototype.enterImport_decl = function(ctx) {
    var fs = require('fs');
    var id = extractString(ctx);

//    this.baseurl.split('/').slice(0, -1) + {

    var input = fs.readFileSync(id, 'utf8');
    var yaml = require('js-yaml');

    var graph;
    try {
        graph = salad(yaml.safeLoad(input));
    } catch (error) {
        graph = convert(input);
    }

    graph["id"] = "#"+ctx.name().getText();
    this.graph[ctx.name().getText()] = graph;
};
