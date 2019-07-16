#!/usr/bin/env cwl-runner
class: ExpressionTool
cwlVersion: v1.0
expression: |-
  ${return {'out': (function(){
    return inputs.foo+1;
  })()};}
id: '#main'
inputs:
  - id: foo
    type: int
outputs:
  - id: out
    type: int
requirements:
  InlineJavascriptRequirement: {}

