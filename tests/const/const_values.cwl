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
  "inputs": [
    {
      "type": "int",
      "default": 12,
      "id": "intval"
    },
    {
      "type": "float",
      "default": 1.2,
      "id": "floatval"
    },
    {
      "type": "string",
      "default": "foobar",
      "id": "strval"
    },
    {
      "type": "File",
      "default": {
        "class": "File",
        "location": "hello.txt"
      },
      "id": "fileval"
    },
    {
      "type": "Any",
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
      "id": "listval"
    },
    {
      "type": "Any",
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
      "id": "structval"
    }
  ],
  "outputs": [
    {
      "id": "iv",
      "type": "int",
      "outputSource": "intval"
    }
  ],
  "steps": [],
  "cwlVersion": "v1.0"
}
