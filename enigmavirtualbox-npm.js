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

/* global process: false */
/* global __dirname: false */
/* global require: false */
/* global console: false */
/* eslint no-console: 0 */

/*
 *  enigmavirtualbox-npm.js: NPM install-time integration
 */

/*  core requirements  */
var child_process = require("child_process");
var fs            = require("fs");
var path          = require("path");

/*  extra requirements  */
var progress      = require("progress");
var promise       = require("promise");
var request       = require("request");
var chalk         = require("chalk");
var rimraf        = require("rimraf");

/*  return download URL for latest PrinceXML distribution  */
var downloadURL = function () {
    return "http://enigmaprotector.com/assets/files/enigmavb.exe";
};

/*  download data from URL  */
var downloadData = function (url) {
    return new promise(function (resolve, reject) {
        console.log("-- download: " + url);
        var options = {
            method: "GET",
            url: url,
            encoding: null,
            headers: {
                "User-Agent": "node-enigmavirtualbox (enigmavirtualbox-npm.js:install)"
            }
        };
        if (typeof process.env.http_proxy === "string" && process.env.http_proxy !== "")
            options.proxy = process.env.http_proxy;
        var req = request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("-- download: " + body.length + " bytes received.");
                resolve(body);
            }
            else
                reject("download failed: " + error);
        });
        var progress_bar = null;
        req.on("response", function (response) {
            var len = parseInt(response.headers["content-length"], 10);
            progress_bar = new progress(
                "-- download: " +
                "[" + chalk.blue(":bar") + "] " +
                chalk.blue(":percent") +
                " (ETA: " + chalk.blue(":eta") + "s)", {
                complete:   "#",
                incomplete: "=",
                width:      40,
                total:      len
            });
        });
        req.on("data", function (data) {
            if (progress_bar !== null)
                progress_bar.tick(data.length);
        });
    });
};

/*  main procedure  */
if (process.platform !== "win32") {
    console.log("WARNING: Enigma Virtual Box is available for Windows platform only! (this module will be void on your platform)");
    process.exit(0);
}
if (process.argv.length !== 3) {
    console.log("ERROR: invalid number of arguments");
    process.exit(1);
}
var destdir;
if (process.argv[2] === "install") {
    /*  installation procedure  */
    console.log("++ downloading Enigma Virtual Box distribution");
    var url = downloadURL();
    downloadData(url).then(function (data) {
        console.log("++ locally unpacking Enigma Virtual Box distribution (please be patient)");
        destdir = path.join(__dirname, "enigmavb");
        var destfile = path.join(__dirname, "enigmavb.exe");
        fs.writeFileSync(destfile, data, { encoding: null });
        var args = [
            "/SILENT",
            "/VERYSILENT",
            "/SP-",
            "/SUPPRESSMSGBOXES",
            "/NORESTART",
            "/NOICONS",
            "/DIR=" + path.resolve(destdir) + ""
        ];
        child_process.execFile(destfile, args, function (error /*, stdout, stderr */) {
            if (error)
                console.log(chalk.red("** ERROR: failed to extract: " + error));
            else {
                fs.unlinkSync(destfile);
                console.log("-- OK: local Enigma Virtual Box installation now available");
            }
        });
    }, function (error) {
        console.log(chalk.red("** ERROR: failed to download: " + error));
    });
}
else if (process.argv[2] === "uninstall") {
    /*  uninstallation procedure  */
    destdir = path.join(__dirname, "enigmavb");
    if (fs.existsSync(destdir)) {
        console.log("++ deleting locally unpacked Enigma Virtual Box distribution");
        rimraf(destdir, function (error) {
            if (error !== null)
                console.log("** ERROR: " + error);
            else
                console.log("-- OK: done");
        });
    }
}
else {
    console.log("ERROR: invalid argument");
    process.exit(1);
}

