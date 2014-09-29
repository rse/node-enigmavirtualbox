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
/* global module: false */
/* global require: false */

/*
 *  enigmavirtualbox-gen.js: Enigma Virtual Box XML configuration generation
 */

var fs   = require("fs");
var path = require("path");

var pathResolve = function (filepath, hasToExist) {
    if (hasToExist && !fs.existsSync(filepath))
        throw new Error("path \"" + filepath + "\" not existing");
    filepath = ".\\" + path.relative(process.cwd(), filepath);
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
        "        <DeleteExtractedOnExit>false</DeleteExtractedOnExit>\n" +
        "        <CompressFiles>false</CompressFiles>\n" +
        "        <Files>\n" +
        "            <File>\n" +
        "                <Type>3</Type>\n" +
        "                <Name>%DEFAULT FOLDER%</Name>\n" +
        "                <Files>\n";
    for (var i = 0; i < args.length; i++) {
        var file = pathResolve(args[i], true);
        var name = path.basename(file);
        xml += "" +
        "                    <File>\n" +
        "                        <Type>2</Type>\n" +
        "                        <Name>" + name + "</Name>\n" +
        "                        <File>" + file + "</File>\n" +
        "                        <ActiveX>false</ActiveX>\n" +
        "                        <ActiveXInstall>false</ActiveXInstall>\n" +
        "                        <Action>0</Action>\n" +
        "                        <OverwriteDateTime>false</OverwriteDateTime>\n" +
        "                        <OverwriteAttributes>false</OverwriteAttributes>\n" +
        "                        <PassCommandLine>false</PassCommandLine>\n" +
        "                    </File>\n";
    }
    xml +=
        "                </Files>\n" +
        "            </File>\n" +
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
        "        <ShareVirtualSystem>false</ShareVirtualSystem>\n" +
        "        <MapExecutableWithTemporaryFile>true</MapExecutableWithTemporaryFile>\n" +
        "        <AllowRunningOfVirtualExeFiles>true</AllowRunningOfVirtualExeFiles>\n" +
        "    </Options>\n" +
        "</>\n";
    return xml.replace(/\s{4}/g, "\t");
};
