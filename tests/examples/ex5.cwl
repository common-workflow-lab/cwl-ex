#!/usr/bin/env cwl-runner
{
  "arguments": [
    "echo",
    "$(inputs.msg)"
  ],
  "class": "CommandLineTool",
  "cwlVersion": "v1.0",
  "id": "#echo",
  "inputs": [
    {
      "id": "msg",
      "type": "string"
    },
    {
      "id": "newline",
      "inputBinding": {
        "position": 1,
        "prefix": "-n"
      },
      "type": [
        "null",
        "boolean"
      ]
    }
  ],
  "outputs": [
    {
      "id": "out",
      "outputBinding": {
        "glob": "msg.txt"
      },
      "type": "File"
    }
  ],
  "requirements": {
    "InlineJavascriptRequirement": {
    }
  },
  "stdout": "msg.txt"
}
