#!/usr/bin/env cwl-runner
cwlVersion: v1.2
$namespaces:
  cwltool: "http://commonwl.org/cwltool#"
$graph:
- class: cwltool:ProcessGenerator
  id: main
  inputs:
  - id: inp
    type:
      - 'null'
      - File
  - id: inpdir
    type:
      - 'null'
      - Directory
  - id: inpfile
    type:
      - 'null'
      - string
    default: 'workflow.cwlex'
  - id: inpcontent
    type:
      - 'null'
      - string
  - id: outname
    type:
      - 'null'
      - string
  outputs: {}
  run: '#cwlex'

- id: cwlex
  arguments:
  - cwlex
  - |
      ${
      if (inputs.inp) return inputs.inp.path;
      return inputs.inpfile;
      }
  class: CommandLineTool
  cwlVersion: v1.0
  inputs:
  - id: inp
    type:
      - 'null'
      - File
  - id: inpdir
    type:
      - 'null'
      - Directory
    loadListing: shallow_listing
  - id: inpfile
    type:
      - 'null'
      - string
    default: 'workflow.cwlex'
  - id: inpcontent
    type:
      - 'null'
      - string
  - id: outname
    type:
      - 'null'
      - string
  outputs:
  - id: runProcess
    outputBinding:
      glob: $(outname(inputs))
    type: File
  requirements:
  - class: DockerRequirement
    dockerPull: commonworkflowlanguage/cwlex
  - class: InitialWorkDirRequirement
    listing:
      - $(inputs.inpdir.listing)
      - entryname: $(inputs.inpfile)
        entry: $(inputs.inpcontent)
  - class: InlineJavascriptRequirement
    expressionLib:
      - |
        function outname(inputs) {
          if (inputs.outname) return inputs.outname;
          if (inputs.inp) return inputs.inp.nameroot+'.cwl';
          return inputs.inpfile.replace(/(.*).cwlex/, '$1.cwl');
        }
  stdout: $(outname(inputs))
