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
    var isSubFolder = filepath.indexOf("\\") > 0;
    if(isSubFolder) {
         return filepath;
    }
    filepath = ".\\" + path.relative(process.cwd(), filepath);
    return filepath;
};

/**
 * Generates a tree structure of the fileList array, e.g.:
 *
 * tree = {
 *    "files": ["index.html"],
 *    "folders": {
 *        "myFolder": {
 *            "files": ["foo.bak", "far.baz"],
 *            "folders": {}
 *        },
 *        "myOtherFolder": {
 *            "files": [],
 *            "folders": {
 *                "nestedFolder": {
 *                    "files": ["foo.bar"],
 *                    "folders": {}
 *                }
 *            }
 *        }
 *    }
 *};
 *
 * @param fileList
 * @param keepFolders
 */
var fileListToTree = function (fileList, keepFolders) {
    var addRecursively = function(obj, items, fullPath) {
        if (items.length == 1) {
            // file in root:
            var file = {};
            file["name"] = items[0];
            file["path"] = path.resolve(fullPath); // absolute path on filesystem is needed.
            obj.files.push(file);
        } else {
            var firstItem = items.shift();
            if (firstItem == '.' || firstItem == '..') {
                addRecursively(obj, items, fullPath);
                return;
            }
            if (!obj.folders.hasOwnProperty(firstItem)) {
                obj.folders[firstItem] = {"files":[], "folders":{}};
            }
            var currentLeaf = obj.folders[firstItem];
            addRecursively(currentLeaf, items, fullPath);
        }

    };
    var tree = {"files":[],  "folders": {}};
    var split, fullPath, lastItem;
    for (var i = 0; i < fileList.length; i++) {
        split = fileList[i].split("\\");
        fullPath = fileList[i];
        if (keepFolders) {
            addRecursively(tree, split, fullPath);
        } else {
            tree.files.push(
                {
                    "name": split[split.length-1],
                    "path": fullPath
                }
            );
        }
    }
    return tree;
};

var getXmlFolderRecursively = function(folderName, currentLeaf, indentLevel) {
    var indent = new Array(indentLevel + 1).join(' ');
    var snippet = "" +
        indent + "<File>\n" +
        indent + "    <Type>3</Type>\n" +
        indent + "    <Name>" + folderName + "</Name>\n" +
        indent + "    <Files>\n";

    if (Object.keys(currentLeaf.folders).length) {
        for (var folder in currentLeaf.folders) {
            if (currentLeaf.folders.hasOwnProperty(folder)) {
                snippet += getXmlFolderRecursively(folder, currentLeaf.folders[folder], indentLevel + 8)
            }
        }
    }
    for (var i = 0; i<currentLeaf.files.length; i++ ) {
        snippet += "" +
            indent + "        <File>\n" +
            indent + "            <Type>2</Type>\n" +
            indent + "            <Name>" + currentLeaf.files[i].name + "</Name>\n" +
            indent + "            <File>" + currentLeaf.files[i].path + "</File>\n" +
            indent + "            <ActiveX>false</ActiveX>\n" +
            indent + "            <ActiveXInstall>false</ActiveXInstall>\n" +
            indent + "            <Action>0</Action>\n" +
            indent + "            <OverwriteDateTime>false</OverwriteDateTime>\n" +
            indent + "            <OverwriteAttributes>false</OverwriteAttributes>\n" +
            indent + "            <PassCommandLine>false</PassCommandLine>\n" +
            indent + "        </File>\n";
    }

    snippet += "" +
        indent + "    </Files>\n" +
        indent + "</File>\n";

    return snippet;
};

/*  the exported API  */
module.exports = function (args, enableSubfolders, compressFiles, deleteExtractedOnExit, shareVirtualSystem, mapExecutableWithTemporaryFile, allowRunningOfVirtualExeFiles) {
    var exe_out = pathResolve(args.shift(), false);
    var exe_in  = pathResolve(args.shift(), true);
    var fileList = [];
    for (var i = 0; i < args.length; i++) {
        var file = pathResolve(args[i], true);
        fileList.push(file);
    }
    var tree = fileListToTree(fileList, enableSubfolders);
    var xml = "" +
        "<?xml encoding=\"utf-16\"?>\n" +
        "<>\n" +
        "    <InputFile>" + exe_in + "</InputFile>\n" +
        "    <OutputFile>" + exe_out + "</OutputFile>\n" +
        "    <Files>\n" +
        "        <Enabled>true</Enabled>\n" +
        "        <DeleteExtractedOnExit>" + (deleteExtractedOnExit ? "true" : "false") + "</DeleteExtractedOnExit>\n" +
        "        <CompressFiles>" + (compressFiles ? "true" : "false") + "</CompressFiles>\n" +
        "        <Files>\n";

    xml += getXmlFolderRecursively("%DEFAULT FOLDER%", tree, 12);

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
        "        <ShareVirtualSystem>" + (shareVirtualSystem ? "true" : "false") + "</ShareVirtualSystem>\n" +
        "        <MapExecutableWithTemporaryFile>" + (mapExecutableWithTemporaryFile ? "true" : "false") + "</MapExecutableWithTemporaryFile>\n" +
        "        <AllowRunningOfVirtualExeFiles>" + (allowRunningOfVirtualExeFiles ? "true" : "false") + "</AllowRunningOfVirtualExeFiles>\n" +
        "    </Options>\n" +
        "</>\n";
    return xml.replace(/\s{4}/g, "\t");
};
