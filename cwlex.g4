grammar cwlex;

root : (workflowdecl | tooldecl | ws)+ ;

javascript : (jsstring | jsexpr | jsblock | jslist | ws | DOLLAR | COLON
	   | COMMA | EQ | QUES | GREATER | LESSER | COMMENT | FLOAT | INTEGER
	   | FILE | DIRECTORY | STDOUT | FOR | EACH | IN | DEF | RUN
	   | RETURN | STRUCT | NOTWS )*?;

jsstring : SQSTRING | DQSTRING | BQSTRING ;

jsexpr : OPENPAREN javascript CLOSEPAREN ;

jsblock : OPENBRACE javascript CLOSEBRACE ;

jslist : OPENBRACKET javascript CLOSEBRACKET ;

subst : typedecl (jsexpr | jsblock) ;

assignment : symbol ws* EQ ws* subst ws*? NEWLINE ;

workflowdecl : DEF ws+ WORKFLOW ws+ name ws* input_params ws* OPENBRACE workflowbody CLOSEBRACE ;

tooldecl : DEF ws+ TOOL ws+ name ws* input_params ws* OPENBRACE toolbody CLOSEBRACE ;

workflowbodyStatement : (assignment | ws | step | tooldecl ) ;

workflowbody : workflowbodyStatement* ws* RETURN ws+ symbolassignlist ws* ;

symbolassign : name | name ws* EQ ws* symbol ;

symbolassignlist : symbol | OPENPAREN ws* symbolassign ws* (COMMA ws* symbolassign)* ws* CLOSEPAREN;

step : symbolassignlist ws* EQ ws* (toolstep | call) ws*? foreach? NEWLINE ;

symbollist : symbol ws* (COMMA ws* symbol)* ;

scatterparams : symbollist ;

scattersources : symbollist ;

foreach : FOR ws+ EACH ws+ scatterparams ws+ IN ws+ scattersources ;

toolstep : RUN ws+ TOOL ws* stepinputs ws* OPENBRACE ws* toolbody ws* CLOSEBRACE ;

call : symbol ws* stepinputs ws* foreach?;

stepinput : name | name EQ (symbol | SQSTRING | DQSTRING | INTEGER | FLOAT | DOLLAR jsexpr) ;

stepinputs : OPENPAREN (stepinput ws* (ws* COMMA ws* stepinput)* ws*)? CLOSEPAREN ;

scriptbody : OPENSCRIPT line*? CLOSESCRIPT ;

freetext : DOLLAR | OPENPAREN | CLOSEPAREN | OPENBRACE | CLOSEBRACE
	    | OPENBRACKET | CLOSEBRACKET
            | COLON | COMMA | EQ | QUES | LESSER | COMMENT | OPENSCRIPT
	    | SQSTRING | DQSTRING | DQSTRING | FLOAT | INTEGER | WORKFLOW | TOOL
	    | FILE | DIRECTORY | STDOUT
	    | FOR | EACH | IN | DEF | RUN | RETURN | STRUCT | NOTWS ;

line : (freetext | SPACE)* NEWLINE ;

argument : freetext+;

redirect : GREATER SPACE* argument ;

command : SPACE* argument (SPACE+ argument)* SPACE* redirect? SPACE* (scriptbody | NEWLINE) ;

file_const : FILE ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;
dir_const : DIRECTORY ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;

const_assignment : name ws* EQ ws* (SQSTRING | DQSTRING | INTEGER | FLOAT | file_const | dir_const) ws*? NEWLINE ;

output_assignment : assignment ;

returnvar : symbol ;
toolbody : (attribute | ws)* (const_assignment | ws)* command (output_assignment | ws)* ;

name : symbol ;
structdecl : STRUCT ws* OPENBRACE ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEBRACE ;
typedecl : (symbol | FILE | DIRECTORY | structdecl) (OPENBRACKET CLOSEBRACKET)? ;

input_params : param_list ;

param_list : OPENPAREN ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEPAREN ;

param_decl : name QUES? ws+ typedecl ;

symbolpart : WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN | DEF | RUN | RETURN | STRUCT | NOTWS;
symbol : NOTWS | symbolpart (symbolpart | INTEGER | FLOAT)+ ;

ws : NEWLINE | SPACE | COMMENT ;

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

NOTWS : ~('\n' | ' ' | '\t') ;