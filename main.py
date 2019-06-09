import sys
from antlr4 import *
from cwl2Lexer import cwl2Lexer
from cwl2Parser import cwl2Parser
from cwl2Listener import cwl2Listener

class MyCL(cwl2Listener):

    # Enter a parse tree produced by cwl2Parser#javascript.
    def enterJavascript(self, ctx:cwl2Parser.JavascriptContext):
        pass

    # Exit a parse tree produced by cwl2Parser#javascript.
    def exitJavascript(self, ctx:cwl2Parser.JavascriptContext):
        pass

    # Enter a parse tree produced by cwl2Parser#assignment.
    def enterAssignment(self, ctx:cwl2Parser.AssignmentContext):
        if ctx.subst():
            print("assignment '%s' '%s'" % (ctx.symbol().getText(), ctx.subst().getText()))
        if ctx.filedecl():
            print("assignment '%s' '%s'" % (ctx.symbol().getText(), ctx.filedecl().getText()))
        if ctx.dirdecl():
            print("assignment '%s' '%s'" % (ctx.symbol().getText(), ctx.dirdecl().getText()))
        if ctx.STDOUT():
            print("assignment '%s' '%s'" % (ctx.symbol().getText(), ctx.STDOUT().getText()))

    # Enter a parse tree produced by cwl2Parser#workflowdecl.
    def enterWorkflowdecl(self, ctx:cwl2Parser.WorkflowdeclContext):
        print("workflow '%s' '%s' '%s'" % (ctx.name().getText(), ctx.input_params().getText(), ctx.output_params().getText()))

    # Enter a parse tree produced by cwl2Parser#toolbody.
    def enterToolbody(self, ctx:cwl2Parser.ToolbodyContext):
        if ctx.input_assignment():
            print("toolbody input '%s'" % (ctx.input_assignment().getText()))
        if ctx.command():
            print("toolbody command '%s'" % ([t.getText() for t in ctx.command().argument()]))
        if ctx.script():
            print("toolbody script '%s' '%s'" % ([t.getText() for t in ctx.script().argument()], ctx.script().scriptbody().getText()))
        if ctx.output_assignment():
            print("toolbody output '%s'" % ([t.getText() for t in ctx.output_assignment()]))

    def enterCall(self, ctx:cwl2Parser.CallContext):
        print("call '%s' '%s'" % (ctx.symbol().getText(), ctx.stepinputs().getText()))


def main(argv):
    input = FileStream(argv[1])
    lexer = cwl2Lexer(input)
    stream = CommonTokenStream(lexer)
    parser = cwl2Parser(stream)
    tree = parser.root()

    walker = ParseTreeWalker()
    walker.walk(MyCL(), tree)

if __name__ == '__main__':
    main(sys.argv)
