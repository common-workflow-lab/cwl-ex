#!/usr/bin/env cwl-runner
$graph:
  - arguments:
      - python
      - '-mschema_salad'
      - '--print-rdfs'
      - $(inputs.schema)
    class: CommandLineTool
    id: '#makerdfs'
    inputs:
      - id: schema
        type: File
      - id: target_path
        type: string
    outputs:
      - id: rdfs
        outputBinding:
          glob: $(inputs.target_path)
        type: File
      - id: targetdir
        outputBinding:
          outputEval: '$(inputs.target_path.match(/^([^/]+)\/[^/]/)[1])'
        type: string
    requirements:
      InlineJavascriptRequirement: {}
    stdout: $(inputs.target_path)
  - arguments:
      - python
      - '-mschema_salad'
      - '--print-jsonld-context'
      - $(inputs.schema)
    class: CommandLineTool
    id: '#makecontext'
    inputs:
      - id: schema
        type: File
      - id: target_path
        type: string
    outputs:
      - id: jsonld_context
        outputBinding:
          glob: $(inputs.target_path)
        type: File
      - id: targetdir
        outputBinding:
          outputEval: '$(inputs.target_path.match(/^([^/]+)\/[^/]/)[1])'
        type: string
    requirements:
      InlineJavascriptRequirement: {}
    stdout: $(inputs.target_path)
  - arguments:
      - sh
      - _script
    class: CommandLineTool
    id: '#inheritance'
    inputs:
      - id: schema
        type: File
      - id: target_path
        type: string
    outputs:
      - id: svg
        outputBinding:
          glob: $(inputs.target_path)
        type: File
      - id: targetdir
        outputBinding:
          outputEval: '$(inputs.target_path.match(/^([^/]+)\/[^/]/)[1])'
        type: string
    requirements:
      InitialWorkDirRequirement:
        listing:
          - entry: >
              schema-salad-tool --print-inheritance-dot "$(inputs.schema.path)"
              | dot -Tsvg
            entryname: _script
      InlineJavascriptRequirement: {}
    stdout: $(inputs.target_path)
  - arguments:
      - schema-salad-doc
      - $(inputs.source)
    class: CommandLineTool
    id: '#makedoc'
    inputs:
      - id: source
        type: File
      - id: renderlist
        inputBinding:
          position: 1
          prefix: '--only'
        type:
          - 'null'
          - items: string
            type: array
      - id: redirect
        inputBinding:
          position: 2
        type:
          - 'null'
          - inputBinding:
              prefix: '--redirect'
            items: string
            type: array
      - id: brand
        inputBinding:
          position: 3
          prefix: '--brand'
        type: string
      - id: brandlink
        inputBinding:
          position: 4
          prefix: '--brandlink'
        type: string
      - id: target
        type: string
      - id: primtype
        inputBinding:
          position: 5
          prefix: '--primtype'
        type:
          - 'null'
          - string
      - id: extra
        type: File
    outputs:
      - id: html
        outputBinding:
          glob: $(inputs.target)
        type: File
      - id: targetdir
        outputBinding:
          outputEval: |-
            ${
                var m = inputs.target.match(/^([^/]+)\/[^/]/);
                if (m)
                   return m[1];
                else
                   return "";
              }
        type: string
      - id: extra_out
        outputBinding:
          outputEval: $(inputs.extra)
        type: File
    requirements:
      InlineJavascriptRequirement: {}
    stdout: $(inputs.target)
  - class: Workflow
    id: '#main'
    inputs:
      - id: render
        type:
          items:
            fields:
              - name: source
                type: File
              - name: renderlist
                type:
                  - 'null'
                  - items: string
                    type: array
              - name: redirect
                type:
                  - 'null'
                  - items: string
                    type: array
              - name: target
                type: string
              - name: brandlink
                type: string
              - name: brandimg
                type: string
              - name: primtype
                type:
                  - 'null'
                  - string
              - name: extra
                type: File
            type: record
          type: array
      - id: schemas
        type:
          items:
            fields:
              - name: schema_in
                type: File
              - name: context_target
                type: string
              - name: rdfs_target
                type: string
              - name: graph_target
                type: string
            type: record
          type: array
      - id: brandimg
        type: File
      - default: ''
        id: empty
        type: string
    outputs:
      - id: doc_out
        outputSource: main_5/doc_out
        type: File
      - id: report
        outputSource: main_6/report
        type: File
    requirements:
      InlineJavascriptRequirement: {}
      MultipleInputFeatureRequirement: {}
      ScatterFeatureRequirement: {}
      StepInputExpressionRequirement: {}
      SubworkflowFeatureRequirement: {}
    steps:
      - id: makerdfs_1
        in:
          schema:
            valueFrom: $(inputs.schemas.schema_in)
          schemas:
            source: schemas
          target_path:
            valueFrom: $(inputs.schemas.rdfs_target)
        out:
          - rdfs
          - targetdir
        run: '#makerdfs'
        scatter:
          - schemas
      - id: makecontext_2
        in:
          schema:
            valueFrom: $(inputs.schemas.schema_in)
          schemas:
            source: schemas
          target_path:
            valueFrom: $(inputs.schemas.context_target)
        out:
          - jsonld_context
          - targetdir
        run: '#makecontext'
        scatter:
          - schemas
      - id: inheritance_3
        in:
          schema:
            valueFrom: $(inputs.schemas.schema_in)
          schemas:
            source: schemas
          target_path:
            valueFrom: $(inputs.schemas.graph_target)
        out:
          - svg
          - targetdir
        run: '#inheritance'
        scatter:
          - schemas
      - id: makedoc_4
        in:
          brand:
            valueFrom: $(inputs.rdr.brandimg)
          brandlink:
            valueFrom: $(inputs.rdr.brandlink)
          extra:
            valueFrom: $(inputs.rdr.extra)
          primtype:
            valueFrom: $(inputs.rdr.primtype)
          rdr:
            source: render
          rdrlist:
            valueFrom: $(inputs.rdr.renderlist)
          redirect:
            valueFrom: $(inputs.rdr.redirect)
          source:
            valueFrom: $(inputs.rdr.source)
          target:
            valueFrom: $(inputs.rdr.target)
        out:
          - html
          - targetdir
          - extra_out
        run: '#makedoc'
        scatter:
          - rdr
      - id: main_5
        in:
          dirs:
            linkMerge: merge_flattened
            source:
              - makedoc_4/targetdir
              - makerdfs_1/targetdir
              - makecontext_2/targetdir
              - inheritance_3/targetdir
              - empty
              - makedoc_4/targetdir
          primary:
            source: makedoc_4/html
          secondary:
            linkMerge: merge_flattened
            source:
              - makedoc_4/html
              - makerdfs_1/rdfs
              - makecontext_2/jsonld_context
              - inheritance_3/svg
              - brandimg
              - makedoc_4/extra_out
        out:
          - doc_out
        run:
          class: ExpressionTool
          expression: |-
            ${return {'doc_out': (function(){
                var primary = inputs.primary[0];
                var secondary = inputs.secondary.slice(1);
                var dirs = inputs.dirs.slice(1);
                primary.secondaryFiles = [];
                for (var i = 0; i < secondary.length; i++) {
                  var k = secondary[i];
                  if (dirs[i] != "") {
                    primary.secondaryFiles.push({
                        class: "Directory",
                        basename: dirs[i],
                        listing: [k]
                    });
                  } else {
                    primary.secondaryFiles.push(k);
                  }
                }
                return primary;
              })()};}
          inputs:
            - id: primary
              type:
                items: File
                type: array
            - id: secondary
              type:
                items: File
                type: array
            - id: dirs
              type:
                items: string
                type: array
          outputs:
            - id: doc_out
              type: File
      - id: main_6
        in:
          doc_out:
            source: main_5/doc_out
        out:
          - report
        run:
          arguments:
            - checklink
            - '-X(http.*|mailto:.*)'
            - '-q'
            - $(inputs.doc_out)
          class: CommandLineTool
          id: main_6_embed
          inputs:
            - id: doc_out
              type: File
          outputs:
            - id: report
              outputBinding:
                glob: linkchecker-report.txt
              type: File
          requirements:
            InlineJavascriptRequirement: {}
          stdout: linkchecker-report.txt
cwlVersion: v1.0

