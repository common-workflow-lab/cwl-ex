#!/usr/bin/env cwl-runner
class: Workflow
cwlVersion: v1.0
id: '#main'
inputs:
  - default:
      - a
      - b
    id: a
    type: Any
  - default:
      - d
      - e
    id: c
    type: Any
outputs:
  - id: result
    linkMerge: merge_flattened
    outputSource:
      - a
      - c
    type:
      items:
        - Any
      type: array
requirements:
  InlineJavascriptRequirement: {}
  MultipleInputFeatureRequirement: {}
  ScatterFeatureRequirement: {}
  StepInputExpressionRequirement: {}
  SubworkflowFeatureRequirement: {}
steps: []

