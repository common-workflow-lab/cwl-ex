#!/usr/bin/env cwl-runner
{
  "class": "ExpressionTool",
  "cwlVersion": "v1.0",
  "expression": "${return {'out': (function(){\n  return inputs.foo+1;\n})()};}",
  "id": "#main",
  "inputs": [
    {
      "id": "foo",
      "type": "int"
    }
  ],
  "outputs": [
    {
      "id": "out",
      "type": "int"
    }
  ],
  "requirements": {
    "InlineJavascriptRequirement": {
    }
  }
}
