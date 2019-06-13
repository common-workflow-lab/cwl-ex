{
  "class": "CommandLineTool",
  "id": "antlr",
  "inputs": [
    {
      "id": "file",
      "type": "File",
      "default": {
        "class": "File",
        "location": "cwlex.g4"
      }
    }
  ],
  "outputs": [
    {
      "id": "parser",
      "outputBinding": {
        "glob": "$(\"*.js\")"
      },
      "type": {
        "type": "array",
        "items": "File"
      }
    }
  ],
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
