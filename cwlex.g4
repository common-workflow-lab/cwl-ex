grammar cwlex;

root : (workflowdecl | tooldecl | ws)+ ;

javascript : (jsstring | jsexpr | jsblock | jslist | ws | DOLLAR | COLON
	   | COMMA | EQ | QUES | GREATER | LESSER | COMMENT | FLOAT | INTEGER
	   | keyword | NOTWS )*?;

jsstring : SQSTRING | DQSTRING | BQSTRING ;

jsexpr : OPENPAREN javascript CLOSEPAREN ;

jsblock : OPENBRACE javascript CLOSEBRACE ;

jslist : OPENBRACKET javascript CLOSEBRACKET ;

workflowdecl : DEF ws+ WORKFLOW ws+ name ws* input_params ws* OPENBRACE workflowbody CLOSEBRACE ;

tooldecl : DEF ws+ TOOL ws+ name ws* input_params ws* OPENBRACE toolbody CLOSEBRACE ;

workflowbodyStatement : (const_assignment | step | ws) ;

workflowbody : workflowbodyStatement* ws* RETURN ws+ symbolassignlist ws* ;

symbolassign : name | name ws* EQ ws* symbol ;

symbolassignlist : symbol | OPENPAREN ws* symbolassign ws* (COMMA ws* symbolassign)* ws* CLOSEPAREN;

linkmerge : (MERGE_NESTED | MERGE_FLATTENED) ws* OPENPAREN ws* symbol (COMMA ws* symbol)* ws* CLOSEPAREN ;

typedexpr : typedecl (jsexpr | jsblock) ;

exprstep : typedexpr ws* stepinputs ;

step : symbolassignlist ws* EQ ws* (exprstep | inlinetool | inlineworkflow | call) ws* foreach? ws* NEWLINE ;

symbollist : symbol ws* (COMMA ws* symbol)* ;

scatterparams : symbollist ;

scattersources : symbollist ;

foreach : FOR ws+ EACH ws+ scatterparams ws+ IN ws+ scattersources ;

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

file_const : FILE ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;
dir_const : DIRECTORY ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;

const_assignment : name ws* EQ ws* (SQSTRING | DQSTRING | INTEGER | FLOAT | file_const | dir_const) ws*? NEWLINE ;

output_assignment : name ws* EQ ws* (typedexpr | symbol) ws*? NEWLINE ;

optional_for_bind : symbol ;
optional_for_over : symbol ;

optional_arg : QUES ws+ argument ws+ (name | FOR ws+ EACH ws+ IN ws+ name)? ws* NEWLINE ;

returnvar : symbol ;
toolbody : (attribute | ws)* (const_assignment | ws)* command (output_assignment | ws)* ;

name : symbol ;
structdecl : STRUCT ws* OPENBRACE ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEBRACE ;
typekeyword : STRING | INT_SYMBOL | FLOAT_SYMBOL | FILE | DIRECTORY;
typedecl : (typekeyword | structdecl) (OPENBRACKET CLOSEBRACKET)? ;

input_params : param_list ;

param_list : OPENPAREN ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEPAREN ;

param_decl : name QUES? ws+ typedecl ;

symbolpart : keyword | NOTWS;
symbol : NOTWS | symbolpart (symbolpart | INTEGER | FLOAT)+ ;

ws : NEWLINE | SPACE | COMMENT ;

keyword : WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN
         | DEF | RUN | RETURN | STRUCT | USING | MERGE_NESTED
	 | MERGE_FLATTENED | INT_SYMBOL | FLOAT_SYMBOL;

attribute : name COLON ws+ (symbol | FLOAT | INTEGER | OPENBRACE ws* (attribute (COMMA | NEWLINE))* ws* CLOSEBRACE) ;

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

SQSTRING: '\'' .*? '\'';
DQSTRING: '"' .*? '"';
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

NOTWS : ~('\n' | ' ' | '\t') ;