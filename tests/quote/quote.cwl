{
  "arguments": [
    "echo",
    "she said \"hello\"",
    "then she said 'goodbye'"
  ],
  "class": "CommandLineTool",
  "cwlVersion": "v1.0",
  "id": "main",
  "inputs": [
  ],
  "outputs": [
    {
      "id": "out",
      "outputBinding": {
        "glob": "$(\"output.txt\")"
      },
      "type": "File"
    }
  ],
  "requirements": {
    "InlineJavascriptRequirement": {
    }
  },
  "stdout": "output.txt"
}
