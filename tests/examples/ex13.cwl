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
          "id": "e1",
          "outputSource": "echo_1/out",
          "type": "File"
        },
        {
          "id": "e2",
          "outputSource": "echo_2/out",
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
              "default": "hello world"
            }
          },
          "out": [
            "out"
          ],
          "run": "#echo"
        },
        {
          "id": "echo_2",
          "in": {
            "msg": {
              "valueFrom": "$(\"hello \"+inputs.msg)"
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
