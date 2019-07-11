#!/usr/bin/env cwl-runner
{
  "$graph": [
    {
      "class": "ExpressionTool",
      "expression": "${return {'out': (function(){\n  return inputs.v + 1;\n})()};}",
      "id": "#addone",
      "inputs": [
        {
          "id": "v",
          "type": "int"
        }
      ],
      "outputs": [
        {
          "id": "out",
          "type": "int"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {
        }
      }
    },
    {
      "class": "Workflow",
      "id": "#main",
      "inputs": [
        {
          "id": "val",
          "type": "int"
        }
      ],
      "outputs": [
        {
          "id": "q",
          "outputSource": "addone_1/out",
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
          "id": "addone_1",
          "in": {
            "v": {
              "source": "val"
            }
          },
          "out": [
            "out"
          ],
          "run": "#addone"
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
