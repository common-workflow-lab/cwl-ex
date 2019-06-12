grammar cwlex;

root : (workflowdecl | tooldecl | ws)+ ;

javascript : (jsstring | jsexpr | jsblock | jslist | ws | DOLLAR | COLON
	   | COMMA | EQ | COMMENT | FLOAT | INTEGER | FILE | DIRECTORY | STDOUT | FOR
	   | EACH | IN | DEF | RUN | NOTWS )*?;

jsstring : SQSTRING | DQSTRING | BQSTRING ;

jsexpr : OPENPAREN javascript CLOSEPAREN ;

jsblock : OPENBRACE javascript CLOSEBRACE ;

jslist : OPENBRACKET javascript CLOSEBRACKET ;

subst : typedecl (jsexpr | jsblock) ;

assignment : symbol ws* EQ ws* subst ws*? NEWLINE ;

workflowdecl : DEF ws+ WORKFLOW ws+ name ws* input_params ws* output_params ws* OPENBRACE workflowbody CLOSEBRACE ;

tooldecl : DEF ws+ TOOL ws+ name ws* input_params ws* output_params ws* OPENBRACE toolbody CLOSEBRACE ;

workflowbodyStatement : (assignment | ws | step | tooldecl) ;

workflowbody : workflowbodyStatement* ;

step : (symbol | stepinputs) ws* EQ ws* (toolstep | call) ws*? foreach? NEWLINE ;

foreach : FOR ws+ EACH ws+ stepinputs ws+ IN ws+ stepinputs ;

toolstep : RUN ws+ TOOL ws* stepinputs ws* output_params ws* OPENBRACE ws* toolbody ws* CLOSEBRACE ;

call : symbol ws* stepinputs ;

stepinput : name | SQSTRING | DQSTRING | name EQ (name | SQSTRING | DQSTRING) ;

stepinputs : OPENPAREN (stepinput ws* (ws* COMMA ws* stepinput)* ws*)? CLOSEPAREN ;

command : SPACE* argument (SPACE+ argument)* SPACE* NEWLINE ;

freetext : DOLLAR | OPENPAREN | CLOSEPAREN | OPENBRACE | CLOSEBRACE | OPENBRACKET | CLOSEBRACKET
            | COLON | COMMA | EQ | HASHBANG | COMMENT | OPENSCRIPT | SQSTRING | DQSTRING | DQSTRING
	    | FLOAT | INTEGER | WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT
	    | FOR | EACH | IN | DEF | RUN | NOTWS ;

line : (freetext | SPACE)* NEWLINE ;

scriptbody : OPENSCRIPT line*? CLOSESCRIPT ;

script : SPACE* HASHBANG argument (SPACE+ argument)* SPACE* scriptbody ;

argument : (freetext)+;

file_const : FILE ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;
dir_const : DIRECTORY ws* OPENPAREN (SQSTRING | DQSTRING) CLOSEPAREN ;

const_assignment : name ws* EQ ws* (SQSTRING | DQSTRING | INTEGER | FLOAT | file_const | dir_const) ws*? NEWLINE ;

output_assignment : assignment ;

toolbody : (attribute | ws)* (const_assignment | ws)* (script | command) (output_assignment | ws)* ;

name : symbol ;
typedecl : (symbol | FILE | DIRECTORY) (OPENBRACKET CLOSEBRACKET)? ;

input_params : param_list ;

output_params : param_list ;

param_list : OPENPAREN ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEPAREN ;

param_decl : name ws+ typedecl ;

symbolpart : WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN | DEF | RUN | NOTWS;
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
NEWLINE : '\n' ;
SPACE  : (' ' | '\t' | '\\\n') ;
HASHBANG : '#!';
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

NOTWS : ~('\n' | ' ' | '\t') ;