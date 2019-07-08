Common Workflow Language experimental grammar.

This is an experimental human-friendly grammar that compiles to [CWL](http://commonwl.org) for execution.

Design principals:

* Don't repeat yourself
* Infer types where possible
* Inline declarations for things that are only used once
* Useful default behaviors when not specified
* Be fun to use

Note!  Although cwl-ex tool already offers a lot of functionality, the
error reporting still needs a lot of work.  If you are trying to use
it and running into problems, please file an issue.

# Installation:

```
npm install cwl-ex
```

# Usage

```
$ cwlex myscript.cwlex > myscript.cwl
```

# Syntax

## Command line tools

### Define a command line tool

Define a tool called `reverse`.  It takes an input parameter called
`msg` which is a `File`.  Run the command `rev` with `msg` as an
argument.  Redirect to `reversed.txt` and return `reversed.txt` as the
output parameter `reversed`.

```
def tool reverse(msg File) {
  rev $(inputs.msg) > reversed.txt
  return File("reversed.txt") as reversed
}
```

### Run a shell script

You can put an arbitrary script between `<<<` and `>>>`.  It will be
created at runtime in a temporary file and added to the command line.

```
def tool reverse(msg File) {
  sh <<<
  cat "$(inputs.msg.path)" | rev > reversed.txt
>>>
  return File("reversed.txt") as reversed
}
```

### Run in a Docker container

Use `DockerRequirement` to run the tool in a Docker container.

```
def tool reverse(msg File) {
  requirements {
    DockerRequirement { dockerPull: debian:9 }
  }
  rev $(inputs.msg) > reversed.txt
  return File("reversed.txt") as reversed
}
```

### Define default parameters

You can set default values for input parameters.

```
def tool echo(msg="hello") {
  echo $(inputs.msg) > msg.txt
  return File("msg.txt") as out
}
```

### Optional arguments

Optional parameters in the input have `?` after the parameter name.
After declaring the main command line, declare optional tool flags in
the form `? <prefix> <parameter>`.

```
def tool echo(msg string, newline? bool) {
  echo $(inputs.msg) > msg.txt
  ? -n newline
  return File("msg.txt") as out
}
```

### Array arguments

The `?` syntax is also used for array parameters.  `? for each in
<parameter>` will add each element in the array to the command line.
Use `? <prefix> for each in <parameter>` to add each item with a
leading option switch.

```
def tool echo(msg[] string) {
  echo > msg.txt
  ? for each in newline
  ? --say for each in newline
  return File("msg.txt") as out
}
```

## Workflows

### Import and execute tools

Assign the output parameter `out` of `echo` to `e`.  Assign the output
parameter `reversed` of `reverse` to `r`.  The output of the workflow
is the output parameter `r`.

```
import "echo.cwlex" as echo
import "reverse.cwlex" as reverse

def workflow main(msg string) {
  out as e = echo(msg)
  reversed as r = reverse(e)
  return r
}
```

### Workflow with tools defined inline

When tools are defined inline, their outputs are implicitly added to
the scope, unless they are explicitly assigned (as in the example
above).  If there is no explicit `return`, the workflow will return
all parameters defined in the workflow.  In this example, the output
parameters are both `echoed` and `reversed`.

```
def workflow main(msg string) {
  run tool echo(msg) {
    echo $(inputs.msg) > msg.txt
    return File("msg.txt") as echoed
  }
  run tool reverse(echoed) {
    rev $(inputs.echoed) > reversed.txt
    return File("reversed.txt") as reversed
  }
}
```

### Scatter a tool over an array

To run a parallel scatter over an array, use `scatter <parameter> do
...`.  The parameter named is added as in input to the tool.  The
output of the step will be an array of values consisting of the output
of each scatter step.

```
import "reverse.cwlex" as reverse

def workflow main(msg File[]) {
  reversed as r = scatter msg do reverse()
  return r
}
```

```
def workflow main(msg File[]) {
  scatter msg do run tool reverse() {
    rev $(inputs.msg) > reversed.txt
    return File("reversed.txt") as reversed
  }
}
```

### Javascript expressions

Javascript expression tools can be declared and called.  Requires a type declaration after the inputs.

```
def expr addone(v int) int {
  return inputs.v + 1;
}

def workflow main(val int) {
  q = addone(val)
}
```

Use `run expr` to run a Javascript tool inline.  Requires a type declaration after the inputs.

```
def workflow main(val int) {
  run expr(val) int {
    return inputs.val + 1;
  }
}
```

### Constants and expressions in step inputs

Step inputs can assigned constant and expression values.

```
import "echo.cwlex" as echo

def workflow main(msg string) {
  out as e1 = echo(msg="hello world")
  out as e2 = echo(msg=$("hello "+inputs.msg))
  return e1, e2
}
```

### Merging several parameters into a single parameter

```
def tool echo(msg[] string) {
  echo > msg.txt
  ? for each in newline
  return File("msg.txt") as out
}

def workflow main(v1="hello", v2="world") {
  echo(msg=merge_flattened(v1, v2))
}
```
