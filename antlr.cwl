#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool
inputs:
  file:
    type: File
    default:
      class: File
      location: cwlex.g4
outputs:
  catch:
    type: File[]
    outputBinding:
      glob: '*.js'
arguments: [antlr4, -Dlanguage=JavaScript, -o, ., $(inputs.file)]
