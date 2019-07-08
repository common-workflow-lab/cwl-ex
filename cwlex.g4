grammar cwlex;

root : (workflowdecl | tooldecl | import_decl | exprdecl | ws)+ ;

javascript : (jsstring | jsexpr | jsblock | jslist | ws | DOLLAR | COLON
	   | COMMA | EQ | QUES | GREATER | LESSER | COMMENT | FLOAT | INTEGER
	   | keyword | NOTWS )*?;

jsstring : SQSTRING | DQSTRING | BQSTRING ;

jsexpr : OPENPAREN javascript CLOSEPAREN ;

jsblock : OPENBRACE javascript CLOSEBRACE ;

jslist : OPENBRACKET javascript CLOSEBRACKET ;

workflowdecl : DEF ws+ WORKFLOW ws+ name ws* input_params ws* OPENBRACE workflowbody CLOSEBRACE ;

tooldecl : DEF ws+ TOOL ws+ name ws* input_params ws* OPENBRACE toolbody CLOSEBRACE ;

req_decl : symbol COMMA? ws+ | symbol ws+ struct_const ws* NEWLINE ;

reqs : (REQUIREMENTS | HINTS) ws+ OPENBRACE ws* (req_decl ws*)* CLOSEBRACE ;

workflowbodyStatement : (const_assignment | step | reqs | ws) ;

workflowbody : workflowbodyStatement* ws* (RETURN ws+ symbolassignlist)? ;

symbolassign : name | (symbol | linkmerge) ws+ AS ws+ name ;

symbolassignlist : symbolassign ws* (COMMA ws* symbolassign ws*)* ;

linkmerge : (MERGE_NESTED | MERGE_FLATTENED) ws* OPENPAREN ws* symbol (COMMA ws* symbol)* ws* CLOSEPAREN ;

typedexpr : typedecl ws* (jsexpr | jsblock) ;

inlineexpr : RUN ws+ EXPR ws+ stepinputs ws* typedexpr ;

steprun : inlineexpr | inlinetool | inlineworkflow | call ;

step : (symbolassignlist ws* EQ)? ws* scatter? ws* steprun ws* NEWLINE ;

scatter : SCATTER ws+ symbolassignlist ws+ DO ws+ ;

inlinetool : RUN ws+ TOOL ws* stepinputs ws* OPENBRACE ws* toolbody ws* CLOSEBRACE ;

inlineworkflowbody : workflowbody ;

inlineworkflow : RUN ws+ WORKFLOW ws* stepinputs ws* OPENBRACE ws* inlineworkflowbody ws* CLOSEBRACE ;

call : symbol ws* stepinputs;

stepinput : name | name ws* EQ ws* (symbol | SQSTRING | DQSTRING | INTEGER | FLOAT | DOLLAR jsexpr | DOLLAR jsblock | linkmerge) ;

stepinputs : OPENPAREN ws* (stepinput ws* (ws* COMMA ws* stepinput)* ws*)? CLOSEPAREN ;

scriptlines : line*? ;

scriptbody : OPENSCRIPT scriptlines CLOSESCRIPT ;

freetext : DOLLAR | OPENPAREN | CLOSEPAREN | OPENBRACE | CLOSEBRACE
	    | OPENBRACKET | CLOSEBRACKET
            | COLON | COMMA | EQ | QUES | LESSER | COMMENT | OPENSCRIPT
	    | SQSTRING | DQSTRING | DQSTRING | FLOAT | INTEGER | keyword | NOTWS ;

line : (freetext | SPACE | GREATER)* NEWLINE ;

argument : freetext+;

redirect : GREATER SPACE* argument ;

command : SPACE* argument (SPACE+ argument)* SPACE* redirect? SPACE* (scriptbody | NEWLINE) (optional_arg | ws)* ;

const_string : SQSTRING | DQSTRING ;

file_const : FILE ws* OPENPAREN ws* const_string ws* (COMMA ws* const_string ws*)* CLOSEPAREN ;
dir_const : DIRECTORY ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;

struct_field_name : (SQSTRING | DQSTRING | symbol) ;
struct_field : struct_field_name ws* COLON ws* const_value ;
struct_const : OPENBRACE ws* struct_field? ws* (COMMA ws* struct_field ws*)* CLOSEBRACE ;
list_entry : const_value ;
list_const : OPENBRACKET ws* list_entry? ws* (COMMA ws* list_entry ws*)* CLOSEBRACKET ;
const_value  : SQSTRING | DQSTRING | INTEGER | FLOAT | file_const | dir_const | struct_const | list_const ;

const_assignment : name ws* EQ ws* const_value ws*? NEWLINE ;

output_assignment : typedexpr ws+ AS ws+ name | symbol (ws+ AS ws+ name)? ;

optional_for_bind : symbol ;
optional_for_over : symbol ;

optional_arg : QUES ws+ (argument ws+ name | (argument ws+)? FOR ws+ EACH ws+ IN ws+ name) ws* NEWLINE ;

returnvar : symbol ;
toolbody : (reqs | ws)* command RETURN ws+ output_assignment ws* (COMMA ws* output_assignment ws*)* ;

name : symbol ;
structdecl : STRUCT ws* OPENBRACE ws* (param_decl ws* (COMMA ws* param_decl ws*)*)? ws* CLOSEBRACE ;
typekeyword : STRING | INT_SYMBOL | FLOAT_SYMBOL | FILE | DIRECTORY;
typedecl : (typekeyword | structdecl) (OPENBRACKET CLOSEBRACKET)? ;

input_params : param_list ;

param_list : OPENPAREN ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEPAREN ;

param_decl : name QUES? ws+ typedecl | name ws* EQ ws* const_value;

symbolpart : keyword | NOTWS;
symbol : NOTWS | symbolpart (symbolpart | INTEGER | FLOAT)+ ;

import_decl : IMPORT ws+ (SQSTRING | DQSTRING) ws+ AS ws+ name ws* NEWLINE ;

exprdecl : DEF ws+ EXPR ws+ name ws* input_params ws* typedexpr ;

ws : NEWLINE | SPACE | COMMENT ;

keyword : WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN
         | DEF | RUN | RETURN | STRUCT | USING | MERGE_NESTED
	 | MERGE_FLATTENED | INT_SYMBOL | FLOAT_SYMBOL | REQUIREMENTS
	 | HINTS | IMPORT | AS | SCATTER | DO | EXPR ;

DOLLAR : '$' ;
OPENPAREN : '(' ;
CLOSEPAREN : ')' ;
OPENBRACE : '{' ;
CLOSEBRACE : '}' ;
OPENBRACKET : '[' ;
CLOSEBRACKET : ']' ;
COLON : ':' ;
COMMA : ',' ;
EQ : '=' ;
QUES : '?';
NEWLINE : '\n' ;
GREATER : '>' ;
LESSER : '<' ;
SPACE  : (' ' | '\t' | '\\\n') ;
COMMENT : ('#' NEWLINE) | ('#' ~('!') .*? NEWLINE) ;
OPENSCRIPT : '<<<\n';
CLOSESCRIPT : '>>>\n';

SQSTRING: '\'' (~'\'' | '\\' '\'')*? '\'';
DQSTRING: '"' (~'"' | '\\' '"')*? '"';
BQSTRING: '`' .*? '`';

FLOAT: '-'? ('0'..'9')+ '.' ('0'..'9')+ ;
INTEGER: '-'? ('0'..'9')+  ;

WORKFLOW : 'workflow';
TOOL : 'tool';
FILE : 'File' ;
DIRECTORY : 'Directory' ;
STDOUT : 'stdout';
FOR : 'for' ;
EACH : 'each' ;
IN : 'in';
DEF : 'def' ;
RUN : 'run' ;
RETURN : 'return';
STRUCT : 'struct';
USING : 'using';
MERGE_NESTED : 'merge_nested';
MERGE_FLATTENED: 'merge_flattened';
STRING : 'string';
INT_SYMBOL : 'int';
FLOAT_SYMBOL : 'float';
REQUIREMENTS : 'requirements';
HINTS : 'hints';
IMPORT : 'import';
AS : 'as';
DO : 'do';
SCATTER : 'scatter';
EXPR : 'expr';

NOTWS : ~('\n' | ' ' | '\t') ;