#!/usr/bin/env cwl-runner
class: Workflow
cwlVersion: v1.0
id: '#main'
inputs:
  - id: arvados_api_hosts
    type:
      items: string
      type: array
  - id: arvados_cluster_ids
    type:
      items: string
      type: array
  - id: superuser_tokens
    type:
      items: string
      type: array
  - id: arvbox_containers
    type:
      items: string
      type: array
outputs:
  - id: logincluster
    outputSource: main_1/logincluster
    type: string
  - id: c
    outputSource: main_2/c
    type:
      items: string
      type: array
  - id: d
    outputSource: main_2/d
    type:
      items: string
      type: array
requirements:
  InlineJavascriptRequirement: {}
  MultipleInputFeatureRequirement: {}
  ScatterFeatureRequirement: {}
  StepInputExpressionRequirement: {}
  SubworkflowFeatureRequirement: {}
steps:
  - id: main_1
    in:
      arvados_cluster_ids:
        source: arvados_cluster_ids
    out:
      - logincluster
    run:
      class: ExpressionTool
      expression: '${return {''logincluster'': (inputs.arvados_cluster_ids[0])};}'
      inputs:
        - id: arvados_cluster_ids
          type:
            items: string
            type: array
      outputs:
        - id: logincluster
          type: string
  - id: main_2
    in:
      cluster_id:
        source: arvados_cluster_ids
      container:
        source: arvbox_containers
      logincluster:
        source: main_1/logincluster
    out:
      - c
      - d
    run:
      class: Workflow
      id: main_2_embed
      inputs:
        - id: container
          type: string
        - id: cluster_id
          type: string
        - id: logincluster
          type: string
      outputs:
        - id: c
          outputSource: main_2_embed_1/c
          type: string
        - id: d
          outputSource: main_2_embed_2/d
          type: string
      requirements:
        - class: EnvVarRequirement
          envDef:
            ARVBOX_CONTAINER: $(inputs.container)
      steps:
        - id: main_2_embed_1
          in:
            cluster_id:
              source: cluster_id
            container:
              source: container
            logincluster:
              source: logincluster
            set_login:
              default:
                class: File
                location: set_login.py
          out:
            - c
          run:
            arguments:
              - sh
              - _script
            class: CommandLineTool
            id: main_2_embed_1_embed
            inputs:
              - id: container
                type: string
              - id: cluster_id
                type: string
              - id: logincluster
                type: string
              - id: set_login
                type: File
            outputs:
              - id: c
                outputBinding:
                  outputEval: $(inputs.container)
                type: string
            requirements:
              InitialWorkDirRequirement:
                listing:
                  - entry: >
                      set -x

                      docker cp
                      $(inputs.container):/var/lib/arvados/cluster_config.yml.override
                      .

                      chmod +w cluster_config.yml.override

                      python $(inputs.set_login.path)
                      cluster_config.yml.override $(inputs.cluster_id)
                      $(inputs.logincluster)

                      docker cp cluster_config.yml.override
                      $(inputs.container):/var/lib/arvados
                    entryname: _script
              InlineJavascriptRequirement: {}
        - id: main_2_embed_2
          in:
            c:
              source: main_2_embed_1/c
            container:
              source: container
          out:
            - d
          run:
            arguments:
              - arvbox
              - hotreset
            class: CommandLineTool
            id: main_2_embed_2_embed
            inputs:
              - id: container
                type: string
              - id: c
                type: string
            outputs:
              - id: d
                outputBinding:
                  outputEval: $(inputs.c)
                type: string
            requirements:
              InlineJavascriptRequirement: {}
    scatter:
      - container
      - cluster_id
    scatterMethod: dotproduct

