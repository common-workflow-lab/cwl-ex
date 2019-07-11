#!/usr/bin/env cwl-runner
{
  "$graph": [
    {
      "arguments": [
        "echo",
        "$(inputs.msg)"
      ],
      "class": "CommandLineTool",
      "id": "#echo",
      "inputs": [
        {
          "id": "msg",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "out",
          "outputBinding": {
            "glob": "blub.txt"
          },
          "type": "File"
        }
      ],
      "requirements": {
        "InlineJavascriptRequirement": {
        }
      },
      "stdout": "blub.txt"
    },
    {
      "class": "Workflow",
      "id": "#main",
      "inputs": [
      ],
      "outputs": [
        {
          "id": "e",
          "outputSource": "echo/out",
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
          "id": "echo",
          "in": {
            "msg": {
              "default": "hello world"
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
