// Generated from /tmp/tmpte19dkck/stgc6bf9231-d979-4151-b9f5-c16dedd81bb9/cwlex.g4 by ANTLR 4.5.3
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u00026\u0194\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e",
    "\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#",
    "\t#\u0004$\t$\u0004%\t%\u0004&\t&\u0004\'\t\'\u0004(\t(\u0004)\t)\u0004",
    "*\t*\u0004+\t+\u0004,\t,\u0004-\t-\u0004.\t.\u0004/\t/\u00040\t0\u0004",
    "1\t1\u00042\t2\u00043\t3\u00044\t4\u00045\t5\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003",
    "\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u0010",
    "\u0003\u0010\u0003\u0010\u0005\u0010\u008b\n\u0010\u0003\u0011\u0003",
    "\u0011\u0003\u0011\u0003\u0011\u0003\u0011\u0007\u0011\u0092\n\u0011",
    "\f\u0011\u000e\u0011\u0095\u000b\u0011\u0003\u0011\u0005\u0011\u0098",
    "\n\u0011\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0014",
    "\u0003\u0014\u0003\u0014\u0003\u0014\u0007\u0014\u00a8\n\u0014\f\u0014",
    "\u000e\u0014\u00ab\u000b\u0014\u0003\u0014\u0003\u0014\u0003\u0015\u0003",
    "\u0015\u0003\u0015\u0003\u0015\u0007\u0015\u00b3\n\u0015\f\u0015\u000e",
    "\u0015\u00b6\u000b\u0015\u0003\u0015\u0003\u0015\u0003\u0016\u0003\u0016",
    "\u0007\u0016\u00bc\n\u0016\f\u0016\u000e\u0016\u00bf\u000b\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0017\u0005\u0017\u00c4\n\u0017\u0003\u0017",
    "\u0006\u0017\u00c7\n\u0017\r\u0017\u000e\u0017\u00c8\u0003\u0017\u0003",
    "\u0017\u0006\u0017\u00cd\n\u0017\r\u0017\u000e\u0017\u00ce\u0003\u0018",
    "\u0005\u0018\u00d2\n\u0018\u0003\u0018\u0006\u0018\u00d5\n\u0018\r\u0018",
    "\u000e\u0018\u00d6\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u001a\u0003",
    "\u001a\u0003\u001a\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003",
    "\u001b\u0003\u001b\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001c\u0003",
    "\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0003",
    "\u001c\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003",
    "\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003 \u0003",
    " \u0003 \u0003!\u0003!\u0003!\u0003!\u0003\"\u0003\"\u0003\"\u0003\"",
    "\u0003#\u0003#\u0003#\u0003#\u0003#\u0003#\u0003#\u0003$\u0003$\u0003",
    "$\u0003$\u0003$\u0003$\u0003$\u0003%\u0003%\u0003%\u0003%\u0003%\u0003",
    "%\u0003&\u0003&\u0003&\u0003&\u0003&\u0003&\u0003&\u0003&\u0003&\u0003",
    "&\u0003&\u0003&\u0003&\u0003\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003",
    "\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003\'\u0003",
    "\'\u0003\'\u0003(\u0003(\u0003(\u0003(\u0003(\u0003(\u0003(\u0003)\u0003",
    ")\u0003)\u0003)\u0003*\u0003*\u0003*\u0003*\u0003*\u0003*\u0003+\u0003",
    "+\u0003+\u0003+\u0003+\u0003+\u0003+\u0003+\u0003,\u0003,\u0003,\u0003",
    ",\u0003,\u0003,\u0003,\u0003,\u0003,\u0003,\u0003,\u0003,\u0003,\u0003",
    "-\u0003-\u0003-\u0003-\u0003-\u0003-\u0003.\u0003.\u0003.\u0003.\u0003",
    ".\u0003.\u0003.\u0003/\u0003/\u0003/\u00030\u00030\u00030\u00031\u0003",
    "1\u00031\u00031\u00031\u00031\u00031\u00031\u00032\u00032\u00032\u0003",
    "2\u00032\u00033\u00033\u00033\u00033\u00033\u00034\u00034\u00034\u0003",
    "4\u00034\u00034\u00035\u00035\u0006\u0093\u00a9\u00b4\u00bd\u00026\u0003",
    "\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011",
    "\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u000f\u001d\u0010\u001f",
    "\u0011!\u0012#\u0013%\u0014\'\u0015)\u0016+\u0017-\u0018/\u00191\u001a",
    "3\u001b5\u001c7\u001d9\u001e;\u001f= ?!A\"C#E$G%I&K\'M(O)Q*S+U,W-Y.",
    "[/]0_1a2c3e4g5i6\u0003\u0002\u0007\u0004\u0002\u000b\u000b\"\"\u0003",
    "\u0002##\u0003\u0002))\u0003\u0002$$\u0004\u0002\u000b\f\"\"\u01a0\u0002",
    "\u0003\u0003\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002",
    "\u0007\u0003\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002",
    "\u000b\u0003\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002",
    "\u000f\u0003\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002",
    "\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002",
    "\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0002",
    "\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003\u0002\u0002\u0002\u0002",
    "\u001f\u0003\u0002\u0002\u0002\u0002!\u0003\u0002\u0002\u0002\u0002",
    "#\u0003\u0002\u0002\u0002\u0002%\u0003\u0002\u0002\u0002\u0002\'\u0003",
    "\u0002\u0002\u0002\u0002)\u0003\u0002\u0002\u0002\u0002+\u0003\u0002",
    "\u0002\u0002\u0002-\u0003\u0002\u0002\u0002\u0002/\u0003\u0002\u0002",
    "\u0002\u00021\u0003\u0002\u0002\u0002\u00023\u0003\u0002\u0002\u0002",
    "\u00025\u0003\u0002\u0002\u0002\u00027\u0003\u0002\u0002\u0002\u0002",
    "9\u0003\u0002\u0002\u0002\u0002;\u0003\u0002\u0002\u0002\u0002=\u0003",
    "\u0002\u0002\u0002\u0002?\u0003\u0002\u0002\u0002\u0002A\u0003\u0002",
    "\u0002\u0002\u0002C\u0003\u0002\u0002\u0002\u0002E\u0003\u0002\u0002",
    "\u0002\u0002G\u0003\u0002\u0002\u0002\u0002I\u0003\u0002\u0002\u0002",
    "\u0002K\u0003\u0002\u0002\u0002\u0002M\u0003\u0002\u0002\u0002\u0002",
    "O\u0003\u0002\u0002\u0002\u0002Q\u0003\u0002\u0002\u0002\u0002S\u0003",
    "\u0002\u0002\u0002\u0002U\u0003\u0002\u0002\u0002\u0002W\u0003\u0002",
    "\u0002\u0002\u0002Y\u0003\u0002\u0002\u0002\u0002[\u0003\u0002\u0002",
    "\u0002\u0002]\u0003\u0002\u0002\u0002\u0002_\u0003\u0002\u0002\u0002",
    "\u0002a\u0003\u0002\u0002\u0002\u0002c\u0003\u0002\u0002\u0002\u0002",
    "e\u0003\u0002\u0002\u0002\u0002g\u0003\u0002\u0002\u0002\u0002i\u0003",
    "\u0002\u0002\u0002\u0003k\u0003\u0002\u0002\u0002\u0005m\u0003\u0002",
    "\u0002\u0002\u0007o\u0003\u0002\u0002\u0002\tq\u0003\u0002\u0002\u0002",
    "\u000bs\u0003\u0002\u0002\u0002\ru\u0003\u0002\u0002\u0002\u000fw\u0003",
    "\u0002\u0002\u0002\u0011y\u0003\u0002\u0002\u0002\u0013{\u0003\u0002",
    "\u0002\u0002\u0015}\u0003\u0002\u0002\u0002\u0017\u007f\u0003\u0002",
    "\u0002\u0002\u0019\u0081\u0003\u0002\u0002\u0002\u001b\u0083\u0003\u0002",
    "\u0002\u0002\u001d\u0085\u0003\u0002\u0002\u0002\u001f\u008a\u0003\u0002",
    "\u0002\u0002!\u0097\u0003\u0002\u0002\u0002#\u0099\u0003\u0002\u0002",
    "\u0002%\u009e\u0003\u0002\u0002\u0002\'\u00a3\u0003\u0002\u0002\u0002",
    ")\u00ae\u0003\u0002\u0002\u0002+\u00b9\u0003\u0002\u0002\u0002-\u00c3",
    "\u0003\u0002\u0002\u0002/\u00d1\u0003\u0002\u0002\u00021\u00d8\u0003",
    "\u0002\u0002\u00023\u00e1\u0003\u0002\u0002\u00025\u00e6\u0003\u0002",
    "\u0002\u00027\u00eb\u0003\u0002\u0002\u00029\u00f5\u0003\u0002\u0002",
    "\u0002;\u00fc\u0003\u0002\u0002\u0002=\u0100\u0003\u0002\u0002\u0002",
    "?\u0105\u0003\u0002\u0002\u0002A\u0108\u0003\u0002\u0002\u0002C\u010c",
    "\u0003\u0002\u0002\u0002E\u0110\u0003\u0002\u0002\u0002G\u0117\u0003",
    "\u0002\u0002\u0002I\u011e\u0003\u0002\u0002\u0002K\u0124\u0003\u0002",
    "\u0002\u0002M\u0131\u0003\u0002\u0002\u0002O\u0141\u0003\u0002\u0002",
    "\u0002Q\u0148\u0003\u0002\u0002\u0002S\u014c\u0003\u0002\u0002\u0002",
    "U\u0152\u0003\u0002\u0002\u0002W\u015a\u0003\u0002\u0002\u0002Y\u0167",
    "\u0003\u0002\u0002\u0002[\u016d\u0003\u0002\u0002\u0002]\u0174\u0003",
    "\u0002\u0002\u0002_\u0177\u0003\u0002\u0002\u0002a\u017a\u0003\u0002",
    "\u0002\u0002c\u0182\u0003\u0002\u0002\u0002e\u0187\u0003\u0002\u0002",
    "\u0002g\u018c\u0003\u0002\u0002\u0002i\u0192\u0003\u0002\u0002\u0002",
    "kl\u0007&\u0002\u0002l\u0004\u0003\u0002\u0002\u0002mn\u0007*\u0002",
    "\u0002n\u0006\u0003\u0002\u0002\u0002op\u0007+\u0002\u0002p\b\u0003",
    "\u0002\u0002\u0002qr\u0007}\u0002\u0002r\n\u0003\u0002\u0002\u0002s",
    "t\u0007\u007f\u0002\u0002t\f\u0003\u0002\u0002\u0002uv\u0007]\u0002",
    "\u0002v\u000e\u0003\u0002\u0002\u0002wx\u0007_\u0002\u0002x\u0010\u0003",
    "\u0002\u0002\u0002yz\u0007<\u0002\u0002z\u0012\u0003\u0002\u0002\u0002",
    "{|\u0007.\u0002\u0002|\u0014\u0003\u0002\u0002\u0002}~\u0007?\u0002",
    "\u0002~\u0016\u0003\u0002\u0002\u0002\u007f\u0080\u0007A\u0002\u0002",
    "\u0080\u0018\u0003\u0002\u0002\u0002\u0081\u0082\u0007\f\u0002\u0002",
    "\u0082\u001a\u0003\u0002\u0002\u0002\u0083\u0084\u0007@\u0002\u0002",
    "\u0084\u001c\u0003\u0002\u0002\u0002\u0085\u0086\u0007>\u0002\u0002",
    "\u0086\u001e\u0003\u0002\u0002\u0002\u0087\u008b\t\u0002\u0002\u0002",
    "\u0088\u0089\u0007^\u0002\u0002\u0089\u008b\u0007\f\u0002\u0002\u008a",
    "\u0087\u0003\u0002\u0002\u0002\u008a\u0088\u0003\u0002\u0002\u0002\u008b",
    " \u0003\u0002\u0002\u0002\u008c\u008d\u0007%\u0002\u0002\u008d\u0098",
    "\u0005\u0019\r\u0002\u008e\u008f\u0007%\u0002\u0002\u008f\u0093\n\u0003",
    "\u0002\u0002\u0090\u0092\u000b\u0002\u0002\u0002\u0091\u0090\u0003\u0002",
    "\u0002\u0002\u0092\u0095\u0003\u0002\u0002\u0002\u0093\u0094\u0003\u0002",
    "\u0002\u0002\u0093\u0091\u0003\u0002\u0002\u0002\u0094\u0096\u0003\u0002",
    "\u0002\u0002\u0095\u0093\u0003\u0002\u0002\u0002\u0096\u0098\u0005\u0019",
    "\r\u0002\u0097\u008c\u0003\u0002\u0002\u0002\u0097\u008e\u0003\u0002",
    "\u0002\u0002\u0098\"\u0003\u0002\u0002\u0002\u0099\u009a\u0007>\u0002",
    "\u0002\u009a\u009b\u0007>\u0002\u0002\u009b\u009c\u0007>\u0002\u0002",
    "\u009c\u009d\u0007\f\u0002\u0002\u009d$\u0003\u0002\u0002\u0002\u009e",
    "\u009f\u0007@\u0002\u0002\u009f\u00a0\u0007@\u0002\u0002\u00a0\u00a1",
    "\u0007@\u0002\u0002\u00a1\u00a2\u0007\f\u0002\u0002\u00a2&\u0003\u0002",
    "\u0002\u0002\u00a3\u00a9\u0007)\u0002\u0002\u00a4\u00a8\n\u0004\u0002",
    "\u0002\u00a5\u00a6\u0007^\u0002\u0002\u00a6\u00a8\u0007)\u0002\u0002",
    "\u00a7\u00a4\u0003\u0002\u0002\u0002\u00a7\u00a5\u0003\u0002\u0002\u0002",
    "\u00a8\u00ab\u0003\u0002\u0002\u0002\u00a9\u00aa\u0003\u0002\u0002\u0002",
    "\u00a9\u00a7\u0003\u0002\u0002\u0002\u00aa\u00ac\u0003\u0002\u0002\u0002",
    "\u00ab\u00a9\u0003\u0002\u0002\u0002\u00ac\u00ad\u0007)\u0002\u0002",
    "\u00ad(\u0003\u0002\u0002\u0002\u00ae\u00b4\u0007$\u0002\u0002\u00af",
    "\u00b3\n\u0005\u0002\u0002\u00b0\u00b1\u0007^\u0002\u0002\u00b1\u00b3",
    "\u0007$\u0002\u0002\u00b2\u00af\u0003\u0002\u0002\u0002\u00b2\u00b0",
    "\u0003\u0002\u0002\u0002\u00b3\u00b6\u0003\u0002\u0002\u0002\u00b4\u00b5",
    "\u0003\u0002\u0002\u0002\u00b4\u00b2\u0003\u0002\u0002\u0002\u00b5\u00b7",
    "\u0003\u0002\u0002\u0002\u00b6\u00b4\u0003\u0002\u0002\u0002\u00b7\u00b8",
    "\u0007$\u0002\u0002\u00b8*\u0003\u0002\u0002\u0002\u00b9\u00bd\u0007",
    "b\u0002\u0002\u00ba\u00bc\u000b\u0002\u0002\u0002\u00bb\u00ba\u0003",
    "\u0002\u0002\u0002\u00bc\u00bf\u0003\u0002\u0002\u0002\u00bd\u00be\u0003",
    "\u0002\u0002\u0002\u00bd\u00bb\u0003\u0002\u0002\u0002\u00be\u00c0\u0003",
    "\u0002\u0002\u0002\u00bf\u00bd\u0003\u0002\u0002\u0002\u00c0\u00c1\u0007",
    "b\u0002\u0002\u00c1,\u0003\u0002\u0002\u0002\u00c2\u00c4\u0007/\u0002",
    "\u0002\u00c3\u00c2\u0003\u0002\u0002\u0002\u00c3\u00c4\u0003\u0002\u0002",
    "\u0002\u00c4\u00c6\u0003\u0002\u0002\u0002\u00c5\u00c7\u00042;\u0002",
    "\u00c6\u00c5\u0003\u0002\u0002\u0002\u00c7\u00c8\u0003\u0002\u0002\u0002",
    "\u00c8\u00c6\u0003\u0002\u0002\u0002\u00c8\u00c9\u0003\u0002\u0002\u0002",
    "\u00c9\u00ca\u0003\u0002\u0002\u0002\u00ca\u00cc\u00070\u0002\u0002",
    "\u00cb\u00cd\u00042;\u0002\u00cc\u00cb\u0003\u0002\u0002\u0002\u00cd",
    "\u00ce\u0003\u0002\u0002\u0002\u00ce\u00cc\u0003\u0002\u0002\u0002\u00ce",
    "\u00cf\u0003\u0002\u0002\u0002\u00cf.\u0003\u0002\u0002\u0002\u00d0",
    "\u00d2\u0007/\u0002\u0002\u00d1\u00d0\u0003\u0002\u0002\u0002\u00d1",
    "\u00d2\u0003\u0002\u0002\u0002\u00d2\u00d4\u0003\u0002\u0002\u0002\u00d3",
    "\u00d5\u00042;\u0002\u00d4\u00d3\u0003\u0002\u0002\u0002\u00d5\u00d6",
    "\u0003\u0002\u0002\u0002\u00d6\u00d4\u0003\u0002\u0002\u0002\u00d6\u00d7",
    "\u0003\u0002\u0002\u0002\u00d70\u0003\u0002\u0002\u0002\u00d8\u00d9",
    "\u0007y\u0002\u0002\u00d9\u00da\u0007q\u0002\u0002\u00da\u00db\u0007",
    "t\u0002\u0002\u00db\u00dc\u0007m\u0002\u0002\u00dc\u00dd\u0007h\u0002",
    "\u0002\u00dd\u00de\u0007n\u0002\u0002\u00de\u00df\u0007q\u0002\u0002",
    "\u00df\u00e0\u0007y\u0002\u0002\u00e02\u0003\u0002\u0002\u0002\u00e1",
    "\u00e2\u0007v\u0002\u0002\u00e2\u00e3\u0007q\u0002\u0002\u00e3\u00e4",
    "\u0007q\u0002\u0002\u00e4\u00e5\u0007n\u0002\u0002\u00e54\u0003\u0002",
    "\u0002\u0002\u00e6\u00e7\u0007H\u0002\u0002\u00e7\u00e8\u0007k\u0002",
    "\u0002\u00e8\u00e9\u0007n\u0002\u0002\u00e9\u00ea\u0007g\u0002\u0002",
    "\u00ea6\u0003\u0002\u0002\u0002\u00eb\u00ec\u0007F\u0002\u0002\u00ec",
    "\u00ed\u0007k\u0002\u0002\u00ed\u00ee\u0007t\u0002\u0002\u00ee\u00ef",
    "\u0007g\u0002\u0002\u00ef\u00f0\u0007e\u0002\u0002\u00f0\u00f1\u0007",
    "v\u0002\u0002\u00f1\u00f2\u0007q\u0002\u0002\u00f2\u00f3\u0007t\u0002",
    "\u0002\u00f3\u00f4\u0007{\u0002\u0002\u00f48\u0003\u0002\u0002\u0002",
    "\u00f5\u00f6\u0007u\u0002\u0002\u00f6\u00f7\u0007v\u0002\u0002\u00f7",
    "\u00f8\u0007f\u0002\u0002\u00f8\u00f9\u0007q\u0002\u0002\u00f9\u00fa",
    "\u0007w\u0002\u0002\u00fa\u00fb\u0007v\u0002\u0002\u00fb:\u0003\u0002",
    "\u0002\u0002\u00fc\u00fd\u0007h\u0002\u0002\u00fd\u00fe\u0007q\u0002",
    "\u0002\u00fe\u00ff\u0007t\u0002\u0002\u00ff<\u0003\u0002\u0002\u0002",
    "\u0100\u0101\u0007g\u0002\u0002\u0101\u0102\u0007c\u0002\u0002\u0102",
    "\u0103\u0007e\u0002\u0002\u0103\u0104\u0007j\u0002\u0002\u0104>\u0003",
    "\u0002\u0002\u0002\u0105\u0106\u0007k\u0002\u0002\u0106\u0107\u0007",
    "p\u0002\u0002\u0107@\u0003\u0002\u0002\u0002\u0108\u0109\u0007f\u0002",
    "\u0002\u0109\u010a\u0007g\u0002\u0002\u010a\u010b\u0007h\u0002\u0002",
    "\u010bB\u0003\u0002\u0002\u0002\u010c\u010d\u0007t\u0002\u0002\u010d",
    "\u010e\u0007w\u0002\u0002\u010e\u010f\u0007p\u0002\u0002\u010fD\u0003",
    "\u0002\u0002\u0002\u0110\u0111\u0007t\u0002\u0002\u0111\u0112\u0007",
    "g\u0002\u0002\u0112\u0113\u0007v\u0002\u0002\u0113\u0114\u0007w\u0002",
    "\u0002\u0114\u0115\u0007t\u0002\u0002\u0115\u0116\u0007p\u0002\u0002",
    "\u0116F\u0003\u0002\u0002\u0002\u0117\u0118\u0007u\u0002\u0002\u0118",
    "\u0119\u0007v\u0002\u0002\u0119\u011a\u0007t\u0002\u0002\u011a\u011b",
    "\u0007w\u0002\u0002\u011b\u011c\u0007e\u0002\u0002\u011c\u011d\u0007",
    "v\u0002\u0002\u011dH\u0003\u0002\u0002\u0002\u011e\u011f\u0007w\u0002",
    "\u0002\u011f\u0120\u0007u\u0002\u0002\u0120\u0121\u0007k\u0002\u0002",
    "\u0121\u0122\u0007p\u0002\u0002\u0122\u0123\u0007i\u0002\u0002\u0123",
    "J\u0003\u0002\u0002\u0002\u0124\u0125\u0007o\u0002\u0002\u0125\u0126",
    "\u0007g\u0002\u0002\u0126\u0127\u0007t\u0002\u0002\u0127\u0128\u0007",
    "i\u0002\u0002\u0128\u0129\u0007g\u0002\u0002\u0129\u012a\u0007a\u0002",
    "\u0002\u012a\u012b\u0007p\u0002\u0002\u012b\u012c\u0007g\u0002\u0002",
    "\u012c\u012d\u0007u\u0002\u0002\u012d\u012e\u0007v\u0002\u0002\u012e",
    "\u012f\u0007g\u0002\u0002\u012f\u0130\u0007f\u0002\u0002\u0130L\u0003",
    "\u0002\u0002\u0002\u0131\u0132\u0007o\u0002\u0002\u0132\u0133\u0007",
    "g\u0002\u0002\u0133\u0134\u0007t\u0002\u0002\u0134\u0135\u0007i\u0002",
    "\u0002\u0135\u0136\u0007g\u0002\u0002\u0136\u0137\u0007a\u0002\u0002",
    "\u0137\u0138\u0007h\u0002\u0002\u0138\u0139\u0007n\u0002\u0002\u0139",
    "\u013a\u0007c\u0002\u0002\u013a\u013b\u0007v\u0002\u0002\u013b\u013c",
    "\u0007v\u0002\u0002\u013c\u013d\u0007g\u0002\u0002\u013d\u013e\u0007",
    "p\u0002\u0002\u013e\u013f\u0007g\u0002\u0002\u013f\u0140\u0007f\u0002",
    "\u0002\u0140N\u0003\u0002\u0002\u0002\u0141\u0142\u0007u\u0002\u0002",
    "\u0142\u0143\u0007v\u0002\u0002\u0143\u0144\u0007t\u0002\u0002\u0144",
    "\u0145\u0007k\u0002\u0002\u0145\u0146\u0007p\u0002\u0002\u0146\u0147",
    "\u0007i\u0002\u0002\u0147P\u0003\u0002\u0002\u0002\u0148\u0149\u0007",
    "k\u0002\u0002\u0149\u014a\u0007p\u0002\u0002\u014a\u014b\u0007v\u0002",
    "\u0002\u014bR\u0003\u0002\u0002\u0002\u014c\u014d\u0007h\u0002\u0002",
    "\u014d\u014e\u0007n\u0002\u0002\u014e\u014f\u0007q\u0002\u0002\u014f",
    "\u0150\u0007c\u0002\u0002\u0150\u0151\u0007v\u0002\u0002\u0151T\u0003",
    "\u0002\u0002\u0002\u0152\u0153\u0007d\u0002\u0002\u0153\u0154\u0007",
    "q\u0002\u0002\u0154\u0155\u0007q\u0002\u0002\u0155\u0156\u0007n\u0002",
    "\u0002\u0156\u0157\u0007g\u0002\u0002\u0157\u0158\u0007c\u0002\u0002",
    "\u0158\u0159\u0007p\u0002\u0002\u0159V\u0003\u0002\u0002\u0002\u015a",
    "\u015b\u0007t\u0002\u0002\u015b\u015c\u0007g\u0002\u0002\u015c\u015d",
    "\u0007s\u0002\u0002\u015d\u015e\u0007w\u0002\u0002\u015e\u015f\u0007",
    "k\u0002\u0002\u015f\u0160\u0007t\u0002\u0002\u0160\u0161\u0007g\u0002",
    "\u0002\u0161\u0162\u0007o\u0002\u0002\u0162\u0163\u0007g\u0002\u0002",
    "\u0163\u0164\u0007p\u0002\u0002\u0164\u0165\u0007v\u0002\u0002\u0165",
    "\u0166\u0007u\u0002\u0002\u0166X\u0003\u0002\u0002\u0002\u0167\u0168",
    "\u0007j\u0002\u0002\u0168\u0169\u0007k\u0002\u0002\u0169\u016a\u0007",
    "p\u0002\u0002\u016a\u016b\u0007v\u0002\u0002\u016b\u016c\u0007u\u0002",
    "\u0002\u016cZ\u0003\u0002\u0002\u0002\u016d\u016e\u0007k\u0002\u0002",
    "\u016e\u016f\u0007o\u0002\u0002\u016f\u0170\u0007r\u0002\u0002\u0170",
    "\u0171\u0007q\u0002\u0002\u0171\u0172\u0007t\u0002\u0002\u0172\u0173",
    "\u0007v\u0002\u0002\u0173\\\u0003\u0002\u0002\u0002\u0174\u0175\u0007",
    "c\u0002\u0002\u0175\u0176\u0007u\u0002\u0002\u0176^\u0003\u0002\u0002",
    "\u0002\u0177\u0178\u0007f\u0002\u0002\u0178\u0179\u0007q\u0002\u0002",
    "\u0179`\u0003\u0002\u0002\u0002\u017a\u017b\u0007u\u0002\u0002\u017b",
    "\u017c\u0007e\u0002\u0002\u017c\u017d\u0007c\u0002\u0002\u017d\u017e",
    "\u0007v\u0002\u0002\u017e\u017f\u0007v\u0002\u0002\u017f\u0180\u0007",
    "g\u0002\u0002\u0180\u0181\u0007t\u0002\u0002\u0181b\u0003\u0002\u0002",
    "\u0002\u0182\u0183\u0007g\u0002\u0002\u0183\u0184\u0007z\u0002\u0002",
    "\u0184\u0185\u0007r\u0002\u0002\u0185\u0186\u0007t\u0002\u0002\u0186",
    "d\u0003\u0002\u0002\u0002\u0187\u0188\u0007v\u0002\u0002\u0188\u0189",
    "\u0007t\u0002\u0002\u0189\u018a\u0007w\u0002\u0002\u018a\u018b\u0007",
    "g\u0002\u0002\u018bf\u0003\u0002\u0002\u0002\u018c\u018d\u0007h\u0002",
    "\u0002\u018d\u018e\u0007c\u0002\u0002\u018e\u018f\u0007n\u0002\u0002",
    "\u018f\u0190\u0007u\u0002\u0002\u0190\u0191\u0007g\u0002\u0002\u0191",
    "h\u0003\u0002\u0002\u0002\u0192\u0193\n\u0006\u0002\u0002\u0193j\u0003",
    "\u0002\u0002\u0002\u0010\u0002\u008a\u0093\u0097\u00a7\u00a9\u00b2\u00b4",
    "\u00bd\u00c3\u00c8\u00ce\u00d1\u00d6\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function cwlexLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

cwlexLexer.prototype = Object.create(antlr4.Lexer.prototype);
cwlexLexer.prototype.constructor = cwlexLexer;

cwlexLexer.EOF = antlr4.Token.EOF;
cwlexLexer.DOLLAR = 1;
cwlexLexer.OPENPAREN = 2;
cwlexLexer.CLOSEPAREN = 3;
cwlexLexer.OPENBRACE = 4;
cwlexLexer.CLOSEBRACE = 5;
cwlexLexer.OPENBRACKET = 6;
cwlexLexer.CLOSEBRACKET = 7;
cwlexLexer.COLON = 8;
cwlexLexer.COMMA = 9;
cwlexLexer.EQ = 10;
cwlexLexer.QUES = 11;
cwlexLexer.NEWLINE = 12;
cwlexLexer.GREATER = 13;
cwlexLexer.LESSER = 14;
cwlexLexer.SPACE = 15;
cwlexLexer.COMMENT = 16;
cwlexLexer.OPENSCRIPT = 17;
cwlexLexer.CLOSESCRIPT = 18;
cwlexLexer.SQSTRING = 19;
cwlexLexer.DQSTRING = 20;
cwlexLexer.BQSTRING = 21;
cwlexLexer.FLOAT = 22;
cwlexLexer.INTEGER = 23;
cwlexLexer.WORKFLOW = 24;
cwlexLexer.TOOL = 25;
cwlexLexer.FILE = 26;
cwlexLexer.DIRECTORY = 27;
cwlexLexer.STDOUT = 28;
cwlexLexer.FOR = 29;
cwlexLexer.EACH = 30;
cwlexLexer.IN = 31;
cwlexLexer.DEF = 32;
cwlexLexer.RUN = 33;
cwlexLexer.RETURN = 34;
cwlexLexer.STRUCT = 35;
cwlexLexer.USING = 36;
cwlexLexer.MERGE_NESTED = 37;
cwlexLexer.MERGE_FLATTENED = 38;
cwlexLexer.STRING = 39;
cwlexLexer.INT_SYMBOL = 40;
cwlexLexer.FLOAT_SYMBOL = 41;
cwlexLexer.BOOLEAN_SYMBOL = 42;
cwlexLexer.REQUIREMENTS = 43;
cwlexLexer.HINTS = 44;
cwlexLexer.IMPORT = 45;
cwlexLexer.AS = 46;
cwlexLexer.DO = 47;
cwlexLexer.SCATTER = 48;
cwlexLexer.EXPR = 49;
cwlexLexer.TRUE_SYMBOL = 50;
cwlexLexer.FALSE_SYMBOL = 51;
cwlexLexer.NOTWS = 52;


cwlexLexer.modeNames = [ "DEFAULT_MODE" ];

cwlexLexer.literalNames = [ null, "'$'", "'('", "')'", "'{'", "'}'", "'['", 
                            "']'", "':'", "','", "'='", "'?'", "'\n'", "'>'", 
                            "'<'", null, null, "'<<<\n'", "'>>>\n'", null, 
                            null, null, null, null, "'workflow'", "'tool'", 
                            "'File'", "'Directory'", "'stdout'", "'for'", 
                            "'each'", "'in'", "'def'", "'run'", "'return'", 
                            "'struct'", "'using'", "'merge_nested'", "'merge_flattened'", 
                            "'string'", "'int'", "'float'", "'boolean'", 
                            "'requirements'", "'hints'", "'import'", "'as'", 
                            "'do'", "'scatter'", "'expr'", "'true'", "'false'" ];

cwlexLexer.symbolicNames = [ null, "DOLLAR", "OPENPAREN", "CLOSEPAREN", 
                             "OPENBRACE", "CLOSEBRACE", "OPENBRACKET", "CLOSEBRACKET", 
                             "COLON", "COMMA", "EQ", "QUES", "NEWLINE", 
                             "GREATER", "LESSER", "SPACE", "COMMENT", "OPENSCRIPT", 
                             "CLOSESCRIPT", "SQSTRING", "DQSTRING", "BQSTRING", 
                             "FLOAT", "INTEGER", "WORKFLOW", "TOOL", "FILE", 
                             "DIRECTORY", "STDOUT", "FOR", "EACH", "IN", 
                             "DEF", "RUN", "RETURN", "STRUCT", "USING", 
                             "MERGE_NESTED", "MERGE_FLATTENED", "STRING", 
                             "INT_SYMBOL", "FLOAT_SYMBOL", "BOOLEAN_SYMBOL", 
                             "REQUIREMENTS", "HINTS", "IMPORT", "AS", "DO", 
                             "SCATTER", "EXPR", "TRUE_SYMBOL", "FALSE_SYMBOL", 
                             "NOTWS" ];

cwlexLexer.ruleNames = [ "DOLLAR", "OPENPAREN", "CLOSEPAREN", "OPENBRACE", 
                         "CLOSEBRACE", "OPENBRACKET", "CLOSEBRACKET", "COLON", 
                         "COMMA", "EQ", "QUES", "NEWLINE", "GREATER", "LESSER", 
                         "SPACE", "COMMENT", "OPENSCRIPT", "CLOSESCRIPT", 
                         "SQSTRING", "DQSTRING", "BQSTRING", "FLOAT", "INTEGER", 
                         "WORKFLOW", "TOOL", "FILE", "DIRECTORY", "STDOUT", 
                         "FOR", "EACH", "IN", "DEF", "RUN", "RETURN", "STRUCT", 
                         "USING", "MERGE_NESTED", "MERGE_FLATTENED", "STRING", 
                         "INT_SYMBOL", "FLOAT_SYMBOL", "BOOLEAN_SYMBOL", 
                         "REQUIREMENTS", "HINTS", "IMPORT", "AS", "DO", 
                         "SCATTER", "EXPR", "TRUE_SYMBOL", "FALSE_SYMBOL", 
                         "NOTWS" ];

cwlexLexer.grammarFileName = "cwlex.g4";



exports.cwlexLexer = cwlexLexer;
