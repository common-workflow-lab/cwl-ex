{
  "class": "CommandLineTool",
  "id": "main",
  "inputs": [],
  "outputs": [],
  "requirements": [
    {
      "listing": [
        {
          "entry": "hello",
          "entryname": "hello.txt"
        }
      ],
      "class": "InitialWorkDirRequirement"
    }
  ],
  "hints": [
    {
      "class": "ShellCommandRequirement"
    }
  ],
  "arguments": [
    "cat",
    "hello.txt"
  ],
  "cwlVersion": "v1.0"
}
