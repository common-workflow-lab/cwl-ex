#!/usr/bin/env cwl-runner
{
  "arguments": [
    "echo"
  ],
  "class": "CommandLineTool",
  "cwlVersion": "v1.0",
  "id": "#echo",
  "inputs": [
    {
      "id": "msg",
      "type": {
        "items": "string",
        "type": "array"
      }
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
