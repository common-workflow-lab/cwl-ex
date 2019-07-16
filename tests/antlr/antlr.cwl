#!/usr/bin/env cwl-runner
arguments:
  - antlr4
  - '-Dlanguage=JavaScript'
  - '-o'
  - .
  - $(inputs.file)
class: CommandLineTool
cwlVersion: v1.0
id: '#antlr'
inputs:
  - default:
      class: File
      location: cwlex.g4
    id: file
    type: File
outputs:
  - id: parser
    outputBinding:
      glob: '*.js'
    type:
      items: File
      type: array
requirements:
  InlineJavascriptRequirement: {}

