{
  "$graph": [
    {
      "arguments": [
        "echo",
        "$(inputs.msg)"
      ],
      "class": "CommandLineTool",
      "cwlVersion": "v1.0",
      "id": "#echo1",
      "inputs": [
        {
          "id": "msg",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "m",
          "outputBinding": {
            "glob": "$(\"msg.txt\")"
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
        "echo",
        "$(inputs.msg)"
      ],
      "class": "CommandLineTool",
      "cwlVersion": "v1.0",
      "id": "#echo2",
      "inputs": [
        {
          "id": "msg",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "id": "m",
          "outputBinding": {
            "glob": "msg.txt"
          },
          "type": "File"
        }
      ],
      "stdout": "msg.txt"
    },
    {
      "class": "Workflow",
      "id": "main",
      "inputs": [
      ],
      "outputs": [
        {
          "id": "m1",
          "outputSource": "echo1/m",
          "type": "File"
        },
        {
          "id": "m2",
          "outputSource": "echo2/m",
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
          "id": "echo1",
          "in": {
            "msg": {
              "default": "foo"
            }
          },
          "out": [
            "m"
          ],
          "run": "#echo1"
        },
        {
          "id": "echo2",
          "in": {
            "msg": {
              "default": "bar"
            }
          },
          "out": [
            "m"
          ],
          "run": "#echo2"
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
