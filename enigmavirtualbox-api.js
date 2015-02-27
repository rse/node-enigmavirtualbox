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

/*  extra requirements  */
var promise       = require("promise");
var iconv         = require("iconv-lite");

/*  determine base directory  */
var basedir       = path.resolve(path.join(__dirname, "enigmavb"));

/*  execute a program  */
var executeProg = function (prog, args, ignoreOutput) {
    return new promise(function (resolve, reject) {
        try {
            var options = {};
            options.cwd = process.cwd();
            child_process.execFile(prog, args, { cwd: process.cwd() },
                function (error, stdout, stderr) {
                    if (error === null && !ignoreOutput && !stdout.match(/(?:.|[\r\n])*\[\d{2}:\d{2}:\d{2}\]/))
                        reject({ error: "unknown error (no processing information found in output)", stdout: stdout, stderr: stderr });
                    else if (error !== null)
                        reject({ error: error, stdout: stdout, stderr: stderr });
                    else {
                        stdout = stdout.replace(/^(?:.|[\r\n])*?((?:\[\d{2}:\d{2}:\d{2}\].*?\r?\n)*).*$/, "$1").replace(/(?:\r?\n)*$/, "");
                        resolve({ stdout: stdout, stderr: stderr });
                    }
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
    path: function (mode) {
        if (mode === "gui")
            return path.join(basedir, "enigmavb.exe");
        else if (mode === "cli")
            return path.join(basedir, "enigmavbconsole.exe");
        else
            throw new Error("unknown mode");
    },
    gui: function () {
        if (process.platform !== "win32")
            throw new Error("ERROR: Enigma Virtual Box GUI can be run under Windows platform only!");
        var args = Array.prototype.slice.call(arguments, 0);
        return executeProg(this.path("gui"), args, true);
    },
    cli: function () {
        if (process.platform !== "win32")
            throw new Error("ERROR: Enigma Virtual Box CLI can be run under Windows platform only!");
        var args = Array.prototype.slice.call(arguments, 0);
        return executeProg(this.path("cli"), args, false);
    },
    gen: function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return new promise(function (resolve, reject) {

            // Default settings for optional flags (compatible with previous releases of node-enigmavirtualbox):
            var enableSubfolders = false; // if set to true, folder structure is inserted into enigma project
            var compressFiles = true;
            var deleteExtractedOnExit = true;
            var shareVirtualSystem = true; // Setting for <options> section.
            var mapExecutableWithTemporaryFile = false; // Setting for <options> section.
            var allowRunningOfVirtualExeFiles = true; // Setting for <options> section.

            try {
                // process options:
                do {
                    var arg = args.shift();
                    switch (arg.toLowerCase()) {
                        case '--enablesubfolders':
                        case '--enablesubfolders=1':
                        case '--enablesubfolders=true':
                            enableSubfolders = true;
                            break;
                        case '--sharevirtualsystem=0':
                        case '--sharevirtualsystem=false':
                            shareVirtualSystem = false;
                            break;
                        case '--mapexecutablewithtemporaryfile':
                        case '--mapexecutablewithtemporaryfile=1':
                        case '--mapexecutablewithtemporaryfile=true':
                            mapExecutableWithTemporaryFile = true;
                            break;
                        case '--allowrunningofvirtualexefiles=0':
                        case '--allowrunningofvirtualexefiles=false':
                            allowRunningOfVirtualExeFiles = false;
                            break;
                        case '--compressfiles=0':
                        case '--compressfiles=false':
                            compressFiles = false;
                            break;
                        case '--deleteextractedonexit=0':
                        case '--deleteextractedonexit=false':
                            deleteExtractedOnExit = false;
                            break;
                    }
                } while (arg.substring(0, 2) == '--');
                if (arg != undefined)
                    args.unshift(arg);

                if (args.length < 3)
                    throw new Error("invalid number of arguments");
                var output = args.shift();
                var xml = require("./enigmavirtualbox-gen.js")(
                    args, enableSubfolders, compressFiles, deleteExtractedOnExit, shareVirtualSystem,
                    mapExecutableWithTemporaryFile, allowRunningOfVirtualExeFiles
                );
                xml = iconv.encode(xml, "utf16le");
                fs.writeFileSync(output, xml, {});
            }
            catch (error) {
                reject({ error: error, stdout: "", stderr: "" });
            }
            resolve({ stdout: "", stderr: "" });
        });
    }
};

