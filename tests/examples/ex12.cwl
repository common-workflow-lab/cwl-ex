#!/usr/bin/env cwl-runner
{
  "class": "Workflow",
  "cwlVersion": "v1.0",
  "id": "#main",
  "inputs": [
    {
      "id": "val",
      "type": "int"
    }
  ],
  "outputs": [
    {
      "id": "out",
      "outputSource": "main_1/out",
      "type": "int"
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
        "val": {
          "source": "val"
        }
      },
      "out": [
        "out"
      ],
      "run": {
        "class": "ExpressionTool",
        "expression": "${return {'out': (function(){\n    return inputs.val + 1;\n  })()};}",
        "inputs": [
          {
            "id": "val",
            "type": "int"
          }
        ],
        "outputs": [
          {
            "id": "out",
            "type": "int"
          }
        ]
      }
    }
  ]
}
