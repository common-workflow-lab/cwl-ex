#!/usr/bin/env cwl-runner
{
  "$graph": [
    {
      "arguments": [
        "rev",
        "$(inputs.msg)"
      ],
      "class": "CommandLineTool",
      "cwlVersion": "v1.0",
      "id": "#reverse",
      "inputs": [
        {
          "id": "msg",
          "type": "File"
        }
      ],
      "outputs": [
        {
          "id": "reversed",
          "outputBinding": {
            "glob": "reversed.txt"
          },
          "type": "File"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {
        }
      },
      "stdout": "reversed.txt"
    },
    {
      "class": "Workflow",
      "id": "#main",
      "inputs": [
        {
          "id": "msg",
          "type": {
            "items": "File",
            "type": "array"
          }
        }
      ],
      "outputs": [
        {
          "id": "r",
          "outputSource": "reverse/reversed",
          "type": {
            "items": "File",
            "type": "array"
          }
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
          "id": "reverse",
          "in": {
            "msg": {
              "source": "msg"
            }
          },
          "out": [
            "reversed"
          ],
          "run": "#reverse",
          "scatter": [
            "msg"
          ]
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
