cwlVersion: v1.0
class: CommandLineTool
inputs:
  msg: string
outputs:
  m:
    type: File
    outputBinding:
      glob: msg.txt
stdout: msg.txt
arguments: [echo, $(inputs.msg)]
