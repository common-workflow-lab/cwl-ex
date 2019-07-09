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
      "default": "hello",
      "id": "msg",
      "type": "string"
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
