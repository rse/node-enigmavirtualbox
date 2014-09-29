/*
**  node-enigmavirtualbox -- Node API for executing Enigma Virtual Box
**  Copyright (c) 2014 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global __dirname: false */
/* global process: false */
/* global module: false */
/* global require: false */

/*
 *  enigmavirtualbox-cli.js: Node run-time CLI
 */

var evb = require("./enigmavirtualbox-api.js");

var argv = process.argv.splice(2)

if (argv.length === 0) {
    console.log(
        "ERROR: missing command (and options)\n" +
        "USAGE: enigmavirtualbox <command> [<arg> ...]\n" +
        "USAGE: enigmavirtualbox gui\n" +
        "USAGE: enigmavirtualbox gen config.evb app.exe app.exe file.x ...\n" +
        "USAGE: enigmavirtualbox cli config.evb template.evb output.dat\n" +
        "USAGE: enigmavirtualbox cli config.evb"
    );
    process.exit(1)
}

var promise;
var cmd = argv.shift();
if (cmd === "gui")
    promise = evb.gui();
else if (cmd === "cli")
    promise = evb.cli(argv);
else if (cmd === "gen")
    promise = evb.gen(argv);
else {
    console.log("ERROR: invalid command");
    process.exit(1);
}
promise.then(function (result) {
    process.exit(0);
}, function (error) {
    console.log("ERROR: failed to execute command \"" + cmd + "\" " + error);
    process.exit(1);
});

