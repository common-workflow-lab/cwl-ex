{
  "$graph": [
    {
      "class": "CommandLineTool",
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
        "InlineJavascriptRequirement": {}
      },
      "arguments": [
        "echo",
        "$(inputs.msg)"
      ],
      "stdout": "msg.txt",
      "cwlVersion": "v1.0"
    },
    {
      "cwlVersion": "v1.0",
      "class": "CommandLineTool",
      "inputs": [
        {
          "type": "string",
          "id": "msg"
        }
      ],
      "outputs": [
        {
          "type": "File",
          "outputBinding": {
            "glob": "msg.txt"
          },
          "id": "m"
        }
      ],
      "stdout": "msg.txt",
      "arguments": [
        "echo",
        "$(inputs.msg)"
      ],
      "id": "#echo2"
    },
    {
      "class": "Workflow",
      "id": "main",
      "requirements": {
        "ScatterFeatureRequirement": {},
        "StepInputExpressionRequirement": {},
        "MultipleInputFeatureRequirement": {},
        "InlineJavascriptRequirement": {},
        "SubworkflowFeatureRequirement": {}
      },
      "inputs": [],
      "outputs": [
        {
          "id": "m1",
          "type": "File",
          "outputSource": "echo1/m"
        },
        {
          "id": "m2",
          "type": "File",
          "outputSource": "echo2/m"
        }
      ],
      "steps": [
        {
          "in": {
            "msg": {
              "default": "foo"
            }
          },
          "out": [
            "m"
          ],
          "id": "echo1",
          "run": "#echo1"
        },
        {
          "in": {
            "msg": {
              "default": "bar"
            }
          },
          "out": [
            "m"
          ],
          "id": "echo2",
          "run": "#echo2"
        }
      ]
    }
  ],
  "cwlVersion": "v1.0"
}
