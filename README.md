
Node-EnigmaVirtualBox
=====================

[Node](http://nodejs.org/) API and CLI for executing Windows tool [Enigma Virtual Box](http://enigmaprotector.com/en/aboutvb.html)
to bundle executable with data files.

<p/>
<img src="https://nodei.co/npm/node-enigmavirtualbox.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/node-enigmavirtualbox.png" alt=""/>

Abstract
--------

This is a [Node](http://nodejs.org/) API and CLI for executing the excellent Windows
tool [Enigma Virtual Box](http://enigmaprotector.com/en/aboutvb.html) from within
JavaScript. The essential point of this Node extension is not primarily
to just abstract away the asynchronous CLI execution. Instead there are
two other major points: First, this Node extension provides a fixed
dependency, as other Node extensions which require Enigma Virtual Box
under Windows can just depend (via their NPM `package.json` file) onto
this extension. Second, as this Node extension automatically downloads,
locally installs and uses an Enigma Virtual Box distribution, there is
no need for any previously available system-wide Enigma Virtual Box
installation. Just depend on this Node extension and Enigma Virtual Box
is available!

Notice
------

Enigma Virtual Box is a tool available for Windows only! Hence, running
the Enigma Virtual Box CLI and GUI requires this Node module to be
used under a Windows run-time platform, of course. Only the built-in
configuration file generator can be used on any platform.

Installation
------------

Use the Node Package Manager (NPM) to install this module
locally (default) or globally (with option `-g`):

    $ npm install [-g] enigmavirtualbox

Usage
-----

```js
var evb = require("enigmavirtualbox");
evb.gen([<option>, ...], <arg>[, <arg>, ...]).then(...);
evb.gui(<arg>[, <arg>, ...]).then(...);   // requires Windows run-time platform
evb.cli(<arg>[, <arg>, ...]).then(...);   // requires Windows run-time platform
```

```sh
$ enigmavirtualbox gen [<option>, ...] <arg> [<arg> ...]
$ enigmavirtualbox gui <arg> [<arg> ...]  # requires Windows run-time platform
$ enigmavirtualbox cli <arg> [<arg> ...]  # requires Windows run-time platform
```

Options
-------

There are some options available for the generation of the *.evb file.
When used, they have to be passed as first arguments to the "gen" call.

These options are useful to bypass the call of the GUI and to fully automate the
creation of the executable, e.g. for a build process.

All options have backwards compatibility to previous releases of Node-EnigmaVirtualBox
that did not have these options yet.

**--enableSubfolder=(true|false)**  
Defaults to *false*. If set to true, the folder structure of the files is kept.
If set to false or omitted, all files will end up in the virtual root directory.

**--shareVirtualSystem=(true|false)**  
Defaults to *true*. Maps to the Enigma Virtual Box GUI option "Share virtual system
to child processes".

**--mapExecutableWithTemporaryFile=(true|false)**  
Defaults to *false*. Maps to the Enigma Virtual Box GUI option "Map executable files
using temporary files".

**--allowRunningOfVirtualExeFiles=(true|false)**  
Defaults to *true*. Maps to the Enigma Virtual Box GUI option "Allow running of virtual
executable files".

**--compressFiles=(true|false)**  
Defaults to *true*. If set to false, files will not be compressed, resulting in a
larger executable file.

**--deleteExtractedOnExit=(true|false)**  
Defaults to *true*. If set to false, extracted files will remain in their temporary
directory. Mainly used for debugging purposes.

Examples
--------

```js
var evb = require("enigmavirtualbox");
evb.gen("app.evp", "app-bundled.exe", "app.exe", "app.dat").then(...);
evb.gui("app.evp").then(...);
evb.cli("app.evp").then(...);
```

```sh
# run the generator to create a new standard configuration
$ enigmavirtualbox gen app.evp app-bundled.exe app.exe app.dat

# run the GUI to create/modify a new/existing configuration
$ enigmavirtualbox gui [app.evp]

# run the CLI to pack application according to configuration
$ enigmavirtualbox cli app.evp
```

Examples with options
---------------------

```js
var evb = require("enigmavirtualbox");
evb.gen("--compressFiles=false", "--enableSubfolders=true", "app.evp", "app-bundled.exe", "app.exe", "app.dat", "subfolder\\file.dat").then(...);
evb.cli("app.evp").then(...);
```

```sh
# run the generator to create a new configuration with subfolders enabled and no compression
$ enigmavirtualbox gen --compressFiles=false --enableSubfolders=true app.evp app-bundled.exe app.exe app.dat subfolder\file.dat

# run the CLI to pack application according to configuration
$ enigmavirtualbox cli app.evp
```



License
-------

Copyright (c) 2014 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

