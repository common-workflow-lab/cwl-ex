#!/usr/bin/env cwl-runner
arguments:
  - rev
  - $(inputs.msg)
class: CommandLineTool
cwlVersion: v1.0
id: '#reverse'
inputs:
  - id: msg
    type: File
outputs:
  - id: reversed
    outputBinding:
      glob: reversed.txt
    type: File
requirements:
  InlineJavascriptRequirement: {}
stdout: reversed.txt

