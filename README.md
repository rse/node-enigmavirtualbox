
Node-EnigmaVirtualBox
=====================

[Node](http://nodejs.org/) API for executing [Enigma Virtual Box](http://enigmaprotector.com/en/aboutvb.html).

<p/>
<img src="https://nodei.co/npm/node-enigmavirtualbox.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/node-enigmavirtualbox.png" alt=""/>

Abstract
--------

This is a [Node](http://nodejs.org/) API for executing the excellent Windows
tool [Enigma Virtual Box](http://enigmaprotector.com/en/aboutvb.html) from within
JavaScript. The essential point of this Node extension is not primarily
to just abstract away the asynchronous CLI execution. Instead there
are two other major points: First, this Node extension provides a
fixed dependency, as other Node extensions which require Enigma Virtual Box
under Windows can just depend (via their NPM `package.json` file) onto this extension.
Second, as this Node extension can automatically download, locally install
and use an Enigma Virtual Box distribution, there is no need for any previously
available global Enigma Virtual Box installation. Just depend on this Node extension and
Enigma Virtual Box is available!

Installation
------------

Use the Node Package Manager (NPM) to install this module
locally (default) or globally (with option `-g`):

    $ npm install [-g] enigmavirtualbox

Usage
-----

```js
var evb = require("enigmavirtualbox");
evb.gen(<arg>[, <arg>, ...]).then(...);
evb.gui(<arg>[, <arg>, ...]).then(...);
evb.cli(<arg>[, <arg>, ...]).then(...);
```

```sh
$ enigmavirtualbox gen <arg> [<arg> ...]
$ enigmavirtualbox gui <arg> [<arg> ...]
$ enigmavirtualbox cli <arg> [<arg> ...]
```

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

# runt the CLI to pack application according to configuration
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

