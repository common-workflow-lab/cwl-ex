#!/usr/bin/env cwl-runner
{
  "class": "Workflow",
  "cwlVersion": "v1.0",
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
      "id": "reversed",
      "outputSource": "main_1/reversed",
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
      "id": "main_1",
      "in": {
        "msg": {
          "source": "msg"
        }
      },
      "out": [
        "reversed"
      ],
      "run": {
        "arguments": [
          "rev",
          "$(inputs.msg)"
        ],
        "class": "CommandLineTool",
        "id": "main_1_embed",
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
      "scatter": [
        "msg"
      ]
    }
  ]
}
