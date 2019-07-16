#!/usr/bin/env cwl-runner
arguments:
  - sh
  - _script
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
  InitialWorkDirRequirement:
    listing:
      - entry: |2
            cat "$(inputs.msg.path)" | rev > reversed.txt
        entryname: _script
  InlineJavascriptRequirement: {}

