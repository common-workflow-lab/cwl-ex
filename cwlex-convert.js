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

CwlExListener.prototype.throwError = function(ctx, msg) {
    throw this.baseurl + ":" + ctx.start.line + ":" + ctx.start.column + " " + msg;
}

CwlExListener.prototype.enterWorkflowdecl = function(ctx) {
    var wf = {
        "class": "Workflow",
        "id": "#"+ctx.name().getText(),
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
    if (!ctx.name()) {
        this.throwError(ctx, "Parse error, missing name from parameter declaration");
    }
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
    if (ctx.children == null) {
        this.throwError(ctx, "Parse error reading type declaration");
    }

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
    this.graph[wf.id.substr(1)] = wf;
    this.popWork("add_fields_to");
    this.popWork("namefield");
    this.popWork("bindings");
};

CwlExListener.prototype.enterWorkflowbody = function(ctx) {
    this.pushWork("symbolassign", []);
}
CwlExListener.prototype.exitWorkflowbody = function(ctx) {
    var sa = this.popWork("symbolassign");
    var wf = this.workTop("tool");
    var bind = this.workTop("bindings");
    if (sa.length == 0) {
        Object.keys(bind).map((k) => {
            var found = false;
            wf.inputs.map((inp) => {
                if (inp.id == k) {
                    found = true;
                }
            });
            if (!found) {
                wf.outputs.push({id: k, type: bind[k].type, outputSource: bind[k].source});
            }
        });
    } else {
        sa.map((m) => {
            if (m[1] instanceof Object) {
                wf.outputs.push({id: m[0],
                                 type: m[1].type,
                                 outputSource: m[1].source,
                                 linkMerge: m[1].linkMerge});
            } else {
                var src = bind[m[1]];
                wf.outputs.push({id: m[0], type: src.type, outputSource: src.source});
            }
        });
    }
}

CwlExListener.prototype.enterTooldecl = function(ctx) {
    var tool = {
        "class": "CommandLineTool",
        "id": "#"+ctx.name().getText(),
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

var extractString = (ctx, removeAll) => {
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
        if ((txt[i] == '"' || txt[i] == "'") && curq == "" && (removeAll || i == 0)) {
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

    if (ca.children == null) {
        this.throwError(ctx, "Parse error reading constant value");
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
    if (ca.TRUE_SYMBOL()) {
        newinput.type = "boolean";
        newinput["default"] = true;
    }
    if (ca.FALSE_SYMBOL()) {
        newinput.type = "boolean";
        newinput["default"] = false;
    }
    if (ca.file_const()) {
        newinput.type = "File";
        newinput["default"] = {
            "class": "File",
            "location": extractString(ca.file_const().const_string()[0])
        };
        if (ca.file_const().const_string().length > 1) {
            newinput["default"]["secondaryFiles"] = [];
            for (var i = 1; i < ca.file_const().const_string().length; i++) {
                newinput["default"]["secondaryFiles"].push({
                    "class": "File",
                    "location": extractString(ca.file_const().const_string()[i])
                });
            }
        }
    }
    if (ca.dir_const()) {
        newinput.type = "Directory";
        newinput["default"] = {
            "class": "Directory",
            "location": extractString(ca.dir_const())
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

    var name;
    if (oa.name()) {
        name = oa.name().getText();
    } else if (oa.symbol()) {
        name = oa.symbol().getText();
    } else {
        name = "out";
    }

    var out;
    for (var i = 0; i < top.outputs.length; i++) {
        if (top.outputs[i].id == name) {
            out = top.outputs[i];
            break
        }
    }
    if (!out) {
        out = {"id": name};
        top.outputs.push(out);
    }
    this.pushWork("set_type_on", out);

    var ob = {};
    out["outputBinding"] = ob;
    if (oa.typedexpr()) {
        out.type = oa.typedexpr().typedecl().getText();

        var expr;
        if (oa.typedexpr().jsexpr()) {
            var txt = oa.typedexpr().jsexpr().getText();
            if (/^\(["'].*["']\)$/.test(txt)) {
                expr = txt.substr(2, txt.length-4);
            } else {
                expr = "$"+txt;
            }
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
        top["arguments"].push(extractString(arg, true));
    });
    if (ctx.redirect()) {
        top["stdout"] = extractString(ctx.redirect().argument());
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
                        tp.inputBinding = {};
                        if (ctx.argument()) {
                            tp.inputBinding.prefix = ctx.argument().getText();
                        }
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

var trimfrag = (f) => {
    if (f[0] == "#") {
        return f.substr(1);
    } else {
        return f;
    }
}

CwlExListener.prototype.exitTooldecl = function(ctx) {
    var tool = this.popWork("tool");
    this.graph[trimfrag(tool.id)] = tool;
    this.popWork("namefield");
    this.popWork("bindings");
}

CwlExListener.prototype.enterStep = function(ctx) {
    this.pushWork("symbolassign", []);
    var step = {"in": {}, "out": []};
    this.pushWork("step", step);
    var stepcount = this.popWork("stepcount");
    this.pushWork("stepcount", stepcount+1);
    this.pushWork("scatterinputs", []);
    if (ctx.steprun().inlineexpr() || ctx.steprun().inlinetool() || ctx.steprun().inlineworkflow()) {
        this.pushWork("inline", true);
    } else {
        if (!ctx.symbolassignlist()) {
            this.throwError(ctx, "Must assign outputs on non-inline calls");
        }
        this.pushWork("inline", false);
    }
};

CwlExListener.prototype.enterSteprun = function(ctx) {
    var si = this.popWork("scatterinputs");
    if (this.workTop("inline")) {
        var emb = {inputs: []};
        this.workTop("step")["run"] = emb;

        si.map((inp) => {
            var found = false;
            emb["inputs"].map((m) => {
                if (m["id"] == inp["id"]) {
                    found = m;
                }
            });
            if (found == false) {
                emb["inputs"].push(inp);
            } else {
                found["type"] = inp["type"];
            }
        });
    }
}

CwlExListener.prototype.enterSymbolassign = function(ctx) {
    if (ctx.symbol()) {
        this.workTop("symbolassign").push([ctx.name().getText(), ctx.symbol().getText()]);
    } else if (ctx.linkmerge()) {
        var link = {};
        var items = this.linkMergeSource(link, ctx);
        link.type = {"type": "array", "items": items};
        this.workTop("symbolassign").push([ctx.name().getText(), link]);
    } else {
        this.workTop("symbolassign").push([ctx.name().getText(), ctx.name().getText()]);
    }
};

CwlExListener.prototype.exitStep = function(ctx) {
    var sa = this.popWork("symbolassign");
    var step = this.popWork("step");
    var emb = this.popWork("embedded");
    if (sa.length == 0) {
        emb["outputs"].map((op) => {
            step.out.push(op.id);
            var tp = op.type;
            if (step["scatter"]) {
                tp = {type: "array", items: tp};
            }
            this.workTop("bindings")[op.id] = {"source": step.id+"/"+op.id, "type": tp};
        });
    } if (sa.length == 1 && sa[0][0] == sa[0][1]) {
        var m = sa[0];
        var find;
        if (emb["outputs"].length != 1) {
            var found = false;
            emb["outputs"].map((op) => {
                if (op["id"] == [m[1]]) {
                    found = true;
                }
            });
            if (!found) {
                this.throwError(ctx, "Called tool must have exactly one output, otherwise step outputs must assign tool output parameters.");
            }
        }
        step.out.push(emb["outputs"][0]["id"]);
        var tp = emb["outputs"][0]["type"];
        this.workTop("bindings")[m[0]] = {"source": step.id+"/"+emb["outputs"][0]["id"], "type": tp};
    } else {
        sa.map((m) => {
            step.out.push(m[1]);

            var tp;
            emb["outputs"].map((op) => {
                if (op["id"] == [m[1]]) {
                    tp = op["type"];
                }
            });
            if (tp === undefined) {
                this.throwError(ctx, "No output parameter '"+m[1]+"'");
            }
            if (step["scatter"]) {
                tp = {type: "array", items: tp};
            }

            this.workTop("bindings")[m[0]] = {"source": step.id+"/"+m[1], "type": tp};
        });
    }
    this.workTop("tool").steps.push(step);
    var il = this.popWork("inline");
};

CwlExListener.prototype.enterCall = function(ctx) {
    this.workTop("step")["id"] = ctx.symbol().getText();
    this.workTop("step")["run"] = this.graph[ctx.symbol().getText()]["id"];
    this.pushWork("embedded", this.graph[ctx.symbol().getText()]);
};

CwlExListener.prototype.exitCall = function(ctx) {
}

CwlExListener.prototype.enterScatter = function(ctx) {
    this.pushWork("symbolassign", []);
}

CwlExListener.prototype.exitScatter = function(ctx) {
    var sa = this.popWork("symbolassign");
    var step = this.workTop("step");
    step.scatter = [];
    var scatterInputs = this.workTop("scatterinputs");
    sa.map((m) => {
        var name = m[0];
        var symbol = m[1];
        step.scatter.push(name);
        if (!step["in"][name]) {
            step["in"][name] = {};
        }
        step["in"][name].source = symbol;

        var bind = this.workTop("bindings")[symbol];
        var tp;
        if (bind.type.type == "array") {
            tp = bind.type.items;
        } else {
            tp = "Any";
        }
        scatterInputs.push({id: name, type: tp});
    });
}

CwlExListener.prototype.linkMergeSource = function(link, ctx) {
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

    return items;
};

CwlExListener.prototype.exitStepinputSourceOrValue = function(ctx) {
    var link = this.workTop("steplink");
    if (ctx.symbol()) {
        var bind = this.workTop("bindings")[ctx.symbol().getText()];
        if (bind === undefined) {
            this.throwError(ctx, "Unknown variable '"+ctx.symbol().getText()+"'");
        }
        link.source = bind.source;
        if (this.workTop("inline")) {
            this.workTop("embedded")["inputs"].push({id: this.workTop("linkname"), type: bind.type});
        }
    } else if (ctx.const_value()) {
        link["default"] = this.popWork("const_value")["default"];
    } else if (ctx.jsexpr()) {
        link["valueFrom"] = '$'+ctx.jsexpr().getText();
    } else if (ctx.jsblock()) {
        link["valueFrom"] = '$'+ctx.jsblock().getText();
    } else if (ctx.linkmerge()) {
        var items = this.linkMergeSource(link, ctx);

        if (this.workTop("inline")) {
            if (items.length == 1) {
                items = items[0];
            }
            this.workTop("embedded").inputs.push({id: this.workTop("linkname"),
                                                  type: {"type": "array", "items": items}});
        }
    } else {
        this.throwError(ctx, "BUG! can't happen");
    }
};

CwlExListener.prototype.enterStepinput = function(ctx) {
    var workin = this.workTop("step")["in"];

    var name;
    if (ctx.name()) {
        name = ctx.name().getText();
    } else {
        var find;
        this.workTop("embedded")["inputs"].map((m) => {
            if (m["default"] === undefined) {
                if (!find) {
                    find = m;
                } else {
                    this.throwError("Called tool must have exactly one required input, otherwise inputs must be named");
                }
            }
        });
        if (!find) {
            this.throwError("Called tool must have exactly one required input, otherwise inputs must be named");
        }
        name = this.workTop("embedded")["inputs"][0].id;
    }

    if (!workin[name]) {
        workin[name] = {};
    }
    var link = workin[name];
    this.pushWork("steplink", link);
    this.pushWork("linkname", name);

    if (!ctx.stepinputSourceOrValue()) {
        var bind = this.workTop("bindings")[name];
        if (bind === undefined) {
            this.throwError(ctx, "Unknown variable '"+name+"'");
        }
        link.source = bind.source;
        if (this.workTop("inline")) {
            this.workTop("embedded")["inputs"].push({id: name, type: bind.type});
        }
    }
};

CwlExListener.prototype.exitStepinput = function(ctx) {
    this.popWork("steplink");
    this.popWork("linkname");
};

CwlExListener.prototype.enterInlineexpr = function(ctx) {
    this.workTop("step")["id"] = trimfrag(this.workTop("tool")["id"]) + "_" + this.workTop("stepcount");
    if (!this.workTop("symbolassign")[0]) {
        this.throwError(ctx, "Missing output assignment");
    }
    var rvar = this.workTop("symbolassign")[0][1];
    var r = {
        "id": rvar
    };
    var tool = this.workTop("step")["run"];
    tool["class"] = "ExpressionTool";
    tool["outputs"] = [r];

    if (!ctx.typedexpr()) {
        this.throwError(ctx, "Parse error in inline expression");
    }

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

CwlExListener.prototype.exitInlineexpr = function(ctx) {
    this.popWork("tool");
    this.popWork("namefield");
    this.popWork("add_fields_to");
    this.popWork("set_type_on");
};

CwlExListener.prototype.enterInlinetool = function(ctx) {
    this.workTop("step")["id"] = trimfrag(this.workTop("tool")["id"]) + "_" + this.workTop("stepcount");
    var tool = this.workTop("step")["run"];
    tool["class"] = "CommandLineTool";
    tool["outputs"] = [];
    tool["id"] = this.workTop("step")["id"]+"_embed";
    tool["requirements"] = {
        "InlineJavascriptRequirement": {}
    };
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
    var outerBindings = this.workTop("bindings");
    var newbindings = {};
    var stepin = this.workTop("step")["in"];
    Object.keys(stepin).map((inp) => {
        newbindings[inp] = {source: inp, type: outerBindings[stepin[inp].source].type};
    });
    this.pushWork("bindings", newbindings);
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

CwlExListener.prototype.enterExprdecl = function(ctx) {
    var rvar = "out";
    var r = {
        "id": rvar
    };

    var tool = {
        "class": "ExpressionTool",
        "id": "#"+ctx.name().getText(),
        inputs: [],
        outputs: [r],
        requirements: {
            "InlineJavascriptRequirement": {}
        }
    };

    if (ctx.typedexpr().jsexpr()) {
        tool.expression = "${return {'"+rvar+"': "+ctx.typedexpr().jsexpr().getText()+"};}";
    }
    if (ctx.typedexpr().jsblock()) {
        tool.expression = "${return {'"+rvar+"': (function()"+ctx.typedexpr().jsblock().getText()+")()};}";
    }

    this.pushWork("tool", tool);
    this.pushWork("add_fields_to", tool.inputs);
    this.pushWork("set_type_on", r);
    this.pushWork("namefield", "id");
};

CwlExListener.prototype.exitExprdecl = function(ctx) {
    var tool = this.popWork("tool");
    this.graph[trimfrag(tool.id)] = tool;
    this.popWork("add_fields_to");
    this.popWork("set_type_on");
    this.popWork("namefield");
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

    var components = this.baseurl.split('/').slice(0, -1);
    components.push(id);
    id = components.join("/");

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
