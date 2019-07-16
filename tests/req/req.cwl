#!/usr/bin/env cwl-runner
arguments:
  - rev
  - hello.txt
class: CommandLineTool
cwlVersion: v1.0
hints:
  - class: ShellCommandRequirement
id: '#main'
inputs: []
outputs:
  - id: out
    outputBinding:
      glob: txt.olleh
    type: File
requirements:
  - class: InitialWorkDirRequirement
    listing:
      - entry: hello
        entryname: hello.txt
stdout: txt.olleh

