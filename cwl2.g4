grammar cwl2;

root : (workflowdecl | tooldecl | ws)+ ;

javascript : (jsstring | jsexpr | jsblock | jslist | ws | DOLLAR | COLON | COMMA | EQ | NOTWS )*?;

jsstring : SQSTRING | DQSTRING ;

jsexpr : OPENPAREN javascript CLOSEPAREN ;

jsblock : OPENBRACE javascript CLOSEBRACE ;

jslist : OPENBRACKET javascript CLOSEBRACKET ;

subst : DOLLAR jsexpr | DOLLAR jsblock ;

filedecl : FILE jsexpr ;

dirdecl : DIRECTORY jsexpr ;

assignment : symbol typedecl?  ws* EQ ws* (subst|filedecl|dirdecl|STDOUT) ws*? NEWLINE ;

workflowdecl : WORKFLOW ws+ name ws* input_params ws* output_params ws* OPENBRACE workflowbody CLOSEBRACE ;

tooldecl : TOOL ws+ name ws* input_params ws* output_params ws* OPENBRACE toolbody CLOSEBRACE ;

workflowbody : (assignment | ws | step)* ;

step : (symbol | stepinputs) ws* EQ ws* (toolstep | call) ws*? foreach? NEWLINE ;

foreach : FOR ws+ EACH ws+ stepinputs ws+ IN ws+ stepinputs ;

toolstep : TOOL ws* stepinputs ws* output_params ws* OPENBRACE ws* toolbody ws* CLOSEBRACE ;

call : symbol ws* stepinputs ;

stepinput : name | SQSTRING | DQSTRING | name EQ (name | SQSTRING | DQSTRING) ;

stepinputs : OPENPAREN (stepinput (COMMA stepinput)*)? CLOSEPAREN ;

command : SPACE* argument (SPACE+ argument)* SPACE* NEWLINE ;

freetext : DOLLAR | OPENPAREN | CLOSEPAREN | OPENBRACE | CLOSEBRACE | OPENBRACKET | CLOSEBRACKET
            | COLON | COMMA | EQ | HASHBANG | OPENSCRIPT | SQSTRING | DQSTRING
	    | WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN | NOTWS ;

line : (freetext | SPACE)* NEWLINE ;

scriptbody : OPENSCRIPT line*? CLOSESCRIPT ;

script : SPACE* HASHBANG argument (SPACE+ argument)* SPACE* scriptbody ;

argument : (freetext)+;

input_assignment : assignment ;
output_assignment : assignment ;

toolbody : (input_assignment | ws)* (script | command) (output_assignment | ws)* ;

name : symbol ;
typedecl : (symbol | FILE | DIRECTORY) (OPENBRACKET CLOSEBRACKET)? ;

input_params : param_list ;

output_params : param_list ;

param_list : OPENPAREN ws* (param_decl ws* (COMMA ws* param_decl)*)? ws* CLOSEPAREN ;

param_decl : name ws+ typedecl ;

symbolpart : WORKFLOW | TOOL | FILE | DIRECTORY | STDOUT | FOR | EACH | IN | NOTWS;
symbol : NOTWS | symbolpart symbolpart+ ;

ws : NEWLINE | SPACE ;

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
SPACE  : (' ' | '\t') ;
HASHBANG : '#!';
OPENSCRIPT : '<<<\n';
CLOSESCRIPT : '>>>\n';

SQSTRING: '\'' .*? '\'';
DQSTRING: '"' .*? '"';
WORKFLOW : 'workflow';
TOOL : 'tool';
FILE : 'File' ;
DIRECTORY : 'Directory' ;
STDOUT : 'stdout';
FOR : 'for' ;
EACH : 'each' ;
IN : 'in';

NOTWS : ~('\n' | ' ' | '\t') ;