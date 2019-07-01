{
  "class": "Workflow",
  "cwlVersion": "v1.0",
  "id": "main",
  "inputs": [
    {
      "default": 12,
      "id": "intval",
      "type": "int"
    },
    {
      "default": 1.2,
      "id": "floatval",
      "type": "float"
    },
    {
      "default": "foobar",
      "id": "strval",
      "type": "string"
    },
    {
      "default": {
        "class": "File",
        "location": "hello.txt"
      },
      "id": "fileval",
      "type": "File"
    },
    {
      "default": [
        "a",
        "b",
        {
          "c": [
            13,
            "d"
          ]
        }
      ],
      "id": "listval",
      "type": "Any"
    },
    {
      "default": {
        "a": "b",
        "c": {
          "d": "e"
        },
        "f": [
          "g",
          12
        ]
      },
      "id": "structval",
      "type": "Any"
    }
  ],
  "outputs": [
    {
      "id": "iv",
      "outputSource": "intval",
      "type": "int"
    },
    {
      "id": "fv",
      "outputSource": "floatval",
      "type": "float"
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
  ]
}
