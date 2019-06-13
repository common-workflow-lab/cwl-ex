{
  "$graph": [
    {
      "class": "CommandLineTool",
      "id": "makerdfs",
      "inputs": [
        {
          "id": "schema",
          "type": "File"
        },
        {
          "id": "target_path",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "rdfs",
          "outputBinding": {
            "glob": "$(inputs.target_path)"
          },
          "type": "File"
        },
        {
          "id": "targetdir",
          "outputBinding": {
            "outputEval": "$(inputs.target_path.match(/^([^/]+)\\/[^/]/)[1])"
          },
          "type": "string"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {}
      },
      "arguments": [
        "python",
        "-mschema_salad",
        "--print-rdfs",
        "$(inputs.schema)"
      ],
      "stdout": "$(inputs.target_path)"
    },
    {
      "class": "Workflow",
      "id": "main",
      "requirements": {
        "ScatterFeatureRequirement": {},
        "StepInputExpressionRequirement": {}
      },
      "inputs": [
        {
          "id": "render",
          "type": {
            "type": "array",
            "items": {
              "type": "record",
              "fields": [
                {
                  "name": "source",
                  "type": "File"
                },
                {
                  "name": "renderlist",
                  "type": [
                    "null",
                    {
                      "type": "array",
                      "items": "string"
                    }
                  ]
                },
                {
                  "name": "redirect",
                  "type": [
                    "null",
                    {
                      "type": "array",
                      "items": "string"
                    }
                  ]
                },
                {
                  "name": "target",
                  "type": "string"
                },
                {
                  "name": "brandlink",
                  "type": "string"
                },
                {
                  "name": "brandimg",
                  "type": "string"
                },
                {
                  "name": "primtype",
                  "type": [
                    "null",
                    "string"
                  ]
                },
                {
                  "name": "extra",
                  "type": "File"
                }
              ]
            }
          }
        },
        {
          "id": "schemas",
          "type": {
            "type": "array",
            "items": {
              "type": "record",
              "fields": [
                {
                  "name": "schema_in",
                  "type": "File"
                },
                {
                  "name": "context_target",
                  "type": "string"
                },
                {
                  "name": "rdfs_target",
                  "type": "string"
                },
                {
                  "name": "graph_target",
                  "type": "string"
                }
              ]
            }
          }
        },
        {
          "id": "brandimg",
          "type": "File"
        }
      ],
      "outputs": [
        {
          "id": "rdfs",
          "type": {
            "type": "array",
            "items": "File"
          },
          "outputSource": "makerdfs/rdfs"
        },
        {
          "id": "targetdir",
          "type": {
            "type": "array",
            "items": "string"
          },
          "outputSource": "makerdfs/targetdir"
        }
      ],
      "steps": [
        {
          "in": {
            "schema": {
              "valueFrom": "$(inputs.schema.schema_in)",
              "source": "schemas"
            },
            "target_path": {
              "valueFrom": "$(inputs.schema.rdfs_target)"
            }
          },
          "out": [
            "rdfs",
            "targetdir"
          ],
          "id": "makerdfs",
          "run": "#makerdfs",
          "scatter": [
            "schema"
          ]
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
