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
 *  enigmavirtualbox-gen.js: Enigma Virtual Box XML configuration generation
 */

var path = require("path");

/*  the exported API  */
module.exports = function (args) {
    var exe_out = args.shift();
    var exe_in  = args.shift();
    var xml = "" +
        "<?xml encoding=\"utf-16\"?>\r\n" +
        "<>\r\n" +
        "    <InputFile>" + exe_in + "</InputFile>\r\n" +
        "    <OutputFile>" + exe_out + "</OutputFile>\r\n" +
        "    <Files>\r\n" +
        "        <Enabled>true</Enabled>\r\n" +
        "        <DeleteExtractedOnExit>false</DeleteExtractedOnExit>\r\n" +
        "        <CompressFiles>false</CompressFiles>\r\n" +
        "        <Files>\r\n" +
        "            <File>\r\n" +
        "                <Type>3</Type>\r\n" +
        "                <Name>%DEFAULT FOLDER%</Name>\r\n" +
        "                <Files>\r\n";
    for (var i = 0; i < args.length; i++) {
        var name = path.basename(args[i]);
        xml += "" +
        "                    <File>\r\n" +
        "                        <Type>2</Type>\r\n" +
        "                        <Name>" + name + "</Name>\r\n" +
        "                        <File>" + args[i] + "</File>\r\n" +
        "                        <ActiveX>false</ActiveX>\r\n" +
        "                        <ActiveXInstall>false</ActiveXInstall>\r\n" +
        "                        <Action>0</Action>\r\n" +
        "                        <OverwriteDateTime>false</OverwriteDateTime>\r\n" +
        "                        <OverwriteAttributes>false</OverwriteAttributes>\r\n" +
        "                        <PassCommandLine>false</PassCommandLine>\r\n" +
        "                    </File>\r\n";
    }
    xml +=
        "                </Files>\r\n" +
        "            </File>\r\n" +
        "        </Files>\r\n" +
        "    </Files>\r\n" +
        "    <Registries>\r\n" +
        "        <Enabled>false</Enabled>\r\n" +
        "        <Registries>\r\n" +
        "            <Registry>\r\n" +
        "                <Type>1</Type>\r\n" +
        "                <Virtual>true</Virtual>\r\n" +
        "                <Name>Classes</Name>\r\n" +
        "                <ValueType>0</ValueType>\r\n" +
        "                <Value/>\r\n" +
        "                <Registries/>\r\n" +
        "            </Registry>\r\n" +
        "            <Registry>\r\n" +
        "                <Type>1</Type>\r\n" +
        "                <Virtual>true</Virtual>\r\n" +
        "                <Name>User</Name>\r\n" +
        "                <ValueType>0</ValueType>\r\n" +
        "                <Value/>\r\n" +
        "                <Registries/>\r\n" +
        "            </Registry>\r\n" +
        "            <Registry>\r\n" +
        "                <Type>1</Type>\r\n" +
        "                <Virtual>true</Virtual>\r\n" +
        "                <Name>Machine</Name>\r\n" +
        "                <ValueType>0</ValueType>\r\n" +
        "                <Value/>\r\n" +
        "                <Registries/>\r\n" +
        "            </Registry>\r\n" +
        "            <Registry>\r\n" +
        "                <Type>1</Type>\r\n" +
        "                <Virtual>true</Virtual>\r\n" +
        "                <Name>Users</Name>\r\n" +
        "                <ValueType>0</ValueType>\r\n" +
        "                <Value/>\r\n" +
        "                <Registries/>\r\n" +
        "            </Registry>\r\n" +
        "            <Registry>\r\n" +
        "                <Type>1</Type>\r\n" +
        "                <Virtual>true</Virtual>\r\n" +
        "                <Name>Config</Name>\r\n" +
        "                <ValueType>0</ValueType>\r\n" +
        "                <Value/>\r\n" +
        "                <Registries/>\r\n" +
        "            </Registry>\r\n" +
        "        </Registries>\r\n" +
        "    </Registries>\r\n" +
        "    <Packaging>\r\n" +
        "        <Enabled>false</Enabled>\r\n" +
        "    </Packaging>\r\n" +
        "    <Options>\r\n" +
        "        <ShareVirtualSystem>false</ShareVirtualSystem>\r\n" +
        "        <MapExecutableWithTemporaryFile>true</MapExecutableWithTemporaryFile>\r\n" +
        "        <AllowRunningOfVirtualExeFiles>true</AllowRunningOfVirtualExeFiles>\r\n" +
        "    </Options>\r\n" +
        "</>\r\n";
    return xml;
};
