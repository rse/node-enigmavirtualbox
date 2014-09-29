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
 *  enigmavirtualbox-api.js: Node run-time API
 */

/*  core requirements  */
var child_process = require("child_process");
var fs            = require("fs");
var path          = require("path");
var util          = require("util");

/*  extra requirements  */
var promise       = require("promise");
var _             = require("lodash");

/*  determine base directory  */
var basedir       = path.resolve(path.join(__dirname, "enigmavb"));

/*  execute a program  */
var executeProg = function (prog, args) {
    return new promise(function (resolve, reject) {
        try {
            var options = {};
            options.cwd = process.cwd();
            child_process.execFile(prog, args, { cwd: process.cwd() },
                function (error, stdout, stderr) {
                    var m;
                    if (error === null && (m = stderr.match(/prince:\s+error:\s+([^\n]+)/)))
                        reject({ error: m[1], stdout: stdout, stderr: stderr });
                    else if (error !== null)
                        reject({ error: error, stdout: stdout, stderr: stderr });
                    else
                        resolve({ stdout: stdout, stderr: stderr });
                }
            );
        }
        catch (exception) {
            reject({ error: exception, stdout: "", stderr: "" });
        }
    });
};

/*  the exported API  */
module.exports = {
    gui: function (args) {
        return executeProg(path.join(basedir, "enigmavb.exe"), args);
    },
    cli: function (args) {
        return executeProg(path.join(basedir, "enigmavbconsole.exe"), args);
    },
    gen: function (args) {
        console.log("TODO");
    }
};

