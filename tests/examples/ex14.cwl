#!/usr/bin/env cwl-runner
{
  "$graph": [
    {
      "arguments": [
        "echo"
      ],
      "class": "CommandLineTool",
      "id": "#echo",
      "inputs": [
        {
          "id": "msg",
          "type": {
            "items": "string",
            "type": "array"
          }
        }
      ],
      "outputs": [
        {
          "id": "out",
          "outputBinding": {
            "glob": "msg.txt"
          },
          "type": "File"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {
        }
      },
      "stdout": "msg.txt"
    },
    {
      "class": "Workflow",
      "id": "#main",
      "inputs": [
        {
          "default": "hello",
          "id": "v1",
          "type": "string"
        },
        {
          "default": "world",
          "id": "v2",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "echo_out",
          "outputSource": "echo_1/out",
          "type": "File"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {
        },
        "MultipleInputFeatureRequirement": {
        },
        "ScatterFeatureRequirement": {
        },
        "StepInputExpressionRequirement": {
        },
        "SubworkflowFeatureRequirement": {
        }
      },
      "steps": [
        {
          "id": "echo_1",
          "in": {
            "msg": {
              "linkMerge": "merge_flattened",
              "source": [
                "v1",
                "v2"
              ]
            }
          },
          "out": [
            "out"
          ],
          "run": "#echo"
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
