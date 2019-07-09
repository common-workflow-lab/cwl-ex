#!/usr/bin/env cwl-runner
{
  "$graph": [
    {
      "arguments": [
        "echo",
        "$(inputs.msg)"
      ],
      "class": "CommandLineTool",
      "cwlVersion": "v1.0",
      "id": "#echo",
      "inputs": [
        {
          "default": "hello",
          "id": "msg",
          "type": "string"
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
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "r",
          "outputSource": "reverse/reversed",
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
              "source": "msg"
            }
          },
          "out": [
            "out"
          ],
          "run": "#echo"
        },
        {
          "id": "reverse",
          "in": {
            "e": {
              "source": "echo/out"
            }
          },
          "out": [
            "reversed"
          ],
          "run": "#reverse"
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
