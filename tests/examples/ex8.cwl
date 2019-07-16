#!/usr/bin/env cwl-runner
class: Workflow
cwlVersion: v1.0
id: '#main'
inputs:
  - id: msg
    type: string
outputs:
  - id: echoed
    outputSource: main_1/echoed
    type: File
  - id: reversed
    outputSource: main_2/reversed
    type: File
requirements:
  InlineJavascriptRequirement: {}
  MultipleInputFeatureRequirement: {}
  ScatterFeatureRequirement: {}
  StepInputExpressionRequirement: {}
  SubworkflowFeatureRequirement: {}
steps:
  - id: main_1
    in:
      msg:
        source: msg
    out:
      - echoed
    run:
      arguments:
        - echo
        - $(inputs.msg)
      class: CommandLineTool
      id: main_1_embed
      inputs:
        - id: msg
          type: string
      outputs:
        - id: echoed
          outputBinding:
            glob: msg.txt
          type: File
      requirements:
        InlineJavascriptRequirement: {}
      stdout: msg.txt
  - id: main_2
    in:
      echoed:
        source: main_1/echoed
    out:
      - reversed
    run:
      arguments:
        - rev
        - $(inputs.echoed)
      class: CommandLineTool
      id: main_2_embed
      inputs:
        - id: echoed
          type: File
      outputs:
        - id: reversed
          outputBinding:
            glob: reversed.txt
          type: File
      requirements:
        InlineJavascriptRequirement: {}
      stdout: reversed.txt

