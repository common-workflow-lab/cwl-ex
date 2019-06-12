{
  "class": "CommandLineTool",
  "id": "antlr",
  "inputs": {
    "file": {
      "type": "File",
      "default": {
        "class": "File",
        "location": "cwlex.g4"
      }
    }
  },
  "outputs": [],
  "requirements": {
    "InlineJavascriptRequirement": {}
  },
  "arguments": [
    "antlr4",
    "-Dlanguage=JavaScript",
    "-o",
    ".",
    "$(inputs.file)"
  ],
  "cwlVersion": "v1.0"
}
