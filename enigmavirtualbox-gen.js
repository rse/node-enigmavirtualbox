/*
**  node-enigmavirtualbox -- Node API for executing Enigma Virtual Box
**  Copyright (c) 2014-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
/* global module:  false */
/* global require: false */

/*
 *  enigmavirtualbox-gen.js: Enigma Virtual Box XML configuration generation
 */

var fs   = require("fs");
var path = require("path");
var glob = require("glob");

var pathResolve = function (filepath, hasToExist) {
    if (hasToExist && !fs.existsSync(filepath))
        throw new Error("path \"" + filepath + "\" not existing");
    filepath = path.relative(process.cwd(), filepath);
    return filepath;
};

/*  the exported API  */
module.exports = function (args) {
    var exe_out = pathResolve(args.shift(), false);
    var exe_in  = pathResolve(args.shift(), true);
    var xml = "" +
        "<?xml encoding=\"utf-16\"?>\n" +
        "<>\n" +
        "    <InputFile>" + exe_in + "</InputFile>\n" +
        "    <OutputFile>" + exe_out + "</OutputFile>\n" +
        "    <Files>\n" +
        "        <Enabled>true</Enabled>\n" +
        "        <DeleteExtractedOnExit>true</DeleteExtractedOnExit>\n" +
        "        <CompressFiles>true</CompressFiles>\n" +
        "        <Files>\n";

    var tree = {};
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        var opts = { leaf: true, extract: false, argument: false };
        var m = arg.match(/^(.+?)([%@])$/);
        if (m) {
            arg       = m[1];
            var flags = m[2];
            if (flags.indexOf("%") >= 0)
                opts.extract = true;
            if (flags.indexOf("@") >= 0)
                opts.argument = true;
        }
        var files = glob.sync(arg);
        for (var k = 0; k < files.length; k++) {
            var file = files[k];
            file = pathResolve(file, true);
            if (file === exe_in)
                continue;
            if (fs.statSync(file).isDirectory())
                file += path.sep;
            var segs = file.split(path.sep);
            var base = tree;
            var j;
            for (j = 0; j < segs.length - 1; j++) {
                if (base[segs[j]] === undefined)
                    base[segs[j]] = {};
                if (typeof base[segs[j]] === "object" && !base[segs[j]].leaf)
                    base = base[segs[j]];
                else
                    throw new Error("conflict between directory and file: " + file);
            }
            if (segs[j] !== "")
                base[segs[j]] = opts;
        }
    }

    var handlePath = function (prefix, basedir, folder, tree) {
        var xml = "";
        xml += prefix + "<File>\n" +
               prefix + "    <Type>3</Type>\n" +
               prefix + "    <Name>" + folder + "</Name>\n" +
               prefix + "    <Files>\n";
        for (var name in tree) {
            if (!tree.hasOwnProperty(name))
                continue;
            var file = path.join(basedir, name);
            if (fs.statSync(file).isDirectory())
                xml += handlePath(prefix + "        ", file, name, tree[name]);
            else {
                xml += "        <File>\n" +
                       "            <Type>2</Type>\n" +
                       "            <Name>" + name + "</Name>\n" +
                       "            <File>" + ".\\" + file + "</File>\n" +
                       "            <ActiveX>false</ActiveX>\n" +
                       "            <ActiveXInstall>false</ActiveXInstall>\n" +
                       "            <Action>" + (tree[name].extract ? "1" : "0") + "</Action>\n" +
                       "            <OverwriteDateTime>false</OverwriteDateTime>\n" +
                       "            <OverwriteAttributes>false</OverwriteAttributes>\n" +
                       "            <PassCommandLine>" + (tree[name].argument ? "true": "false") + "</PassCommandLine>\n" +
                       "        </File>\n";
            }
        }
        xml += prefix + "    </Files>\n";
        xml += prefix + "</File>\n";
        return xml;
    };
    xml += handlePath("            ", ".", "%DEFAULT FOLDER%", tree);

    xml +=
        "        </Files>\n" +
        "    </Files>\n" +
        "    <Registries>\n" +
        "        <Enabled>false</Enabled>\n" +
        "        <Registries>\n" +
        "            <Registry>\n" +
        "                <Type>1</Type>\n" +
        "                <Virtual>true</Virtual>\n" +
        "                <Name>Classes</Name>\n" +
        "                <ValueType>0</ValueType>\n" +
        "                <Value/>\n" +
        "                <Registries/>\n" +
        "            </Registry>\n" +
        "            <Registry>\n" +
        "                <Type>1</Type>\n" +
        "                <Virtual>true</Virtual>\n" +
        "                <Name>User</Name>\n" +
        "                <ValueType>0</ValueType>\n" +
        "                <Value/>\n" +
        "                <Registries/>\n" +
        "            </Registry>\n" +
        "            <Registry>\n" +
        "                <Type>1</Type>\n" +
        "                <Virtual>true</Virtual>\n" +
        "                <Name>Machine</Name>\n" +
        "                <ValueType>0</ValueType>\n" +
        "                <Value/>\n" +
        "                <Registries/>\n" +
        "            </Registry>\n" +
        "            <Registry>\n" +
        "                <Type>1</Type>\n" +
        "                <Virtual>true</Virtual>\n" +
        "                <Name>Users</Name>\n" +
        "                <ValueType>0</ValueType>\n" +
        "                <Value/>\n" +
        "                <Registries/>\n" +
        "            </Registry>\n" +
        "            <Registry>\n" +
        "                <Type>1</Type>\n" +
        "                <Virtual>true</Virtual>\n" +
        "                <Name>Config</Name>\n" +
        "                <ValueType>0</ValueType>\n" +
        "                <Value/>\n" +
        "                <Registries/>\n" +
        "            </Registry>\n" +
        "        </Registries>\n" +
        "    </Registries>\n" +
        "    <Packaging>\n" +
        "        <Enabled>false</Enabled>\n" +
        "    </Packaging>\n" +
        "    <Options>\n" +
        "        <ShareVirtualSystem>true</ShareVirtualSystem>\n" +
        "        <MapExecutableWithTemporaryFile>false</MapExecutableWithTemporaryFile>\n" +
        "        <AllowRunningOfVirtualExeFiles>true</AllowRunningOfVirtualExeFiles>\n" +
        "    </Options>\n" +
        "</>\n";
    return xml.replace(/\s{4}/g, "\t");
};

