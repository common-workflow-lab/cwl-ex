# Using cwl-ex with cwltool process generator.

It is possible to invoke a cwl-ex script directly at the command line.

```
$ export CWLTOOL_OPTIONS='--enable-dev --enable-ext'

$ ./echo.cwlex --help
URI prefix 'cwltool' of 'cwltool:loop' not recognized, are you missing a $namespaces section?
usage: ./echo.cwlex [-h] [--msg MSG] [job_order]

positional arguments:
  job_order   Job input json file

optional arguments:
  -h, --help  show this help message and exit
  --msg MSG

$ ./echo.cwlex --msg "hello world"
URI prefix 'cwltool' of 'cwltool:loop' not recognized, are you missing a $namespaces section?
{
    "out": {
        "location": "file:///home/peter/work/cwl-ex/procgen/msg.txt",
        "basename": "msg.txt",
        "class": "File",
        "checksum": "sha1$22596363b3de40b06f981fb85d82312e8c0ed511",
        "size": 12,
        "path": "/home/peter/work/cwl-ex/procgen/msg.txt"
    }

$ cat msg.txt
hello world
```

Now let's take a look at `echo.cwlex`:

```
#!/usr/bin/env cwltool
{cwl:tool: cwlex.cwl, inpcontent: {$include: "#attachment-1"}, inpdir: {class: Directory, location: .}}
--- |
def tool echo(msg="hello") {
  echo $(inputs.msg) > msg.txt
  return File("msg.txt") as out
}
```

This isn't CWL, but it's being executed by `cwltool`, so what's going on?  Let's break it down.

This is actually a multi-part YAML file.  The `---` line is the
divider between the first section and the second section.  Cwltool lets you
reference these sections as `#attachment-0`, `#attachment-1` and so forth.

The first section starts with `#!/usr/bin/env cwltool`.  This is a
Unix "hash-bang" line that specifies that the script should be run
using `cwltool` as the interpreter.  Conveniently, `#` is also a
comment character in YAML.

The next line is a YAML object:

```
{cwl:tool: cwlex.cwl, inpcontent: {$include: "#attachment-1"}, inpdir: {class: Directory, location: .}}`
```

This tells `cwltool` to invoke the tool `cwlex.cwl`.  The other fields
are supplied as parameters to the tool.

The next line is the section divider.

```
--- |
```

The trailing `|` specifies that the next section is a multi-line
string.  As mentioned, this section can be referenced with the
identifier `#attachment-1`.

This means that `{$include: "#attachment-1"}` in the input parameters
will replaced with the string value of `#attachment-1` -- which is our
script that we are going to turn into CWL on the fly.

The contents of `cwlex.cwl` are two tools.  The first one is a new one, the ProcessGenerator:

```
- class: cwltool:ProcessGenerator
  id: main
  inputs: ...
  outputs: {}
  run: '#cwlex'
```

ProcessGenerator has two phases.

1. Run the tool in `run` and get back a File output parameter called `runProcess`
2. Load and run the CWL File returned in `runProcess` with the input parameters given to the process generator

So in this example, it runs the `cwlex` translator to generate CWL
from the supplied script.  Then it is loaded and executed as if it
were the original workflow input.
