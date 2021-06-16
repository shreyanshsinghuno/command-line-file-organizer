#!/usr/bin/env node

// taking input

let inputArray = process.argv;
let fs = require("fs");

let path = require("path");

//console.log(inputArray);
// so first two indexes contains node path and file path respectively
// to store our input we can slice this array from index two onwards;
inputArray = process.argv.slice(2);
// this will contsin everything we write after file name
//console.log(inputArray);
// we'll use following as commands for our tasks
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help

let command = inputArray[0];
let types = {
  media: ["mp4", "mkv", "png", "jpg", "gif", "jpeg", "mp3"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "txt",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "ps",
    "tex",
  ],
  app: ["exe", "dmg", "pkb", "deb"],
  webpages: ["webp"],
};
switch (command) {
  case "tree":
    treeFn(inputArray[1]);
    break;
  case "organize":
    organizeFn(inputArray[1]);
    break;
  case "help":
    helpFn();
    break;
  default:
    console.log("No such command found");
    break;
}

function treeFn(directoryPath) {
  // console.log("Tree command is running for : ", directoryPath);
  let finPath;
  // 1.  input a directoryPath
  // now if directory path is not provided in cmd , the function will still be called
  // with the value of directoryPath as undefined , so we have to handle that case'
  if (directoryPath == undefined) {
    treeHelper(process.cwd(), "");
    return;
  } else {
    // now we have to check that wether the directory path inserted is correct or not
    // we'll use fileSystem Library functions for this
    if (fs.existsSync(directoryPath) == true) {
      treeHelper(directoryPath, "");
    } else {
      console.log("No such directory found");
      return;
    }
  }
}

function treeHelper(directoryPath, indent) {
  // check wether current isFile or isFolder !
  // if isFile then print
  // else if folder recursively call treeHelper to that folder

  let isFile = fs.lstatSync(directoryPath).isFile();
  if (isFile) {
    let fileName = path.basename(directoryPath);
    console.log(indent + "├──" + fileName);
  } else {
    let dirName = path.basename(directoryPath);
    console.log(indent + "└──" + dirName);
    let childrens = fs.readdirSync(directoryPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(directoryPath, childrens[i]);
      treeHelper(childPath, indent + "\t");
    }
  }
}

function organizeFn(directoryPath) {
  // sudo
  let finPath;
  // 1.  input a directoryPath
  // now if directory path is not provided in cmd , the function will still be called
  // with the value of directoryPath as undefined , so we have to handle that case'
  if (directoryPath == undefined) {
    console.log("Insert Correct Path");
    return;
  } else {
    // now we have to check that wether the directory path inserted is correct or not
    // we'll use fileSystem Library functions for this
    if (fs.existsSync(directoryPath) == true) {
      // organize
      // 2.  create a directory named organized files

      finPath = path.join(directoryPath, "organized-files"); // creates path of our final directory
      // fs.mkdirSync(finPath); // creates a folder with given path
      // but running this command again with same path will give us error because
      // there will be already a directory with same path , so we'll have to handle this
      if (fs.existsSync(finPath) == false) {
        fs.mkdirSync(finPath);
      }
    } else {
      console.log("No such directory found");
      return;
    }
  }
  // 3.  check all files extension and identify categories of all the files in that directory
  // 4.  copy / cut to the organized directory according to their category
  // 5.
  // console.log("organize command is running for : ", directoryPath);
  organizeHelper(directoryPath, finPath);
}

function organizeHelper(src, dest) {
  let childrens = fs.readdirSync(src);
  for (let i = 0; i < childrens.length; i++) {
    let childAddress = path.join(src, childrens[i]);
    //console.log(childAddress);
    let isFile = fs.lstatSync(childAddress).isFile();
    let category;
    if (isFile) {
      // console.log(childrens[i]);
      category = findCategory(childAddress);
      console.log(childrens[i], "  belongs-to   ", category);
    } else {
      continue;
    }
    sendFiles(childAddress, dest, category);
  }
}

function sendFiles(srcFilePath, dest, category) {
  let categoryPath = path.join(dest, category);
  let dirExists = fs.existsSync(categoryPath);
  if (dirExists == false) {
    fs.mkdirSync(categoryPath);
  } else {
    let newFileName = path.basename(srcFilePath);
    let destPath = path.join(categoryPath, newFileName);
    fs.copyFileSync(srcFilePath, destPath);
    fs.unlinkSync(srcFilePath);
    console.log(newFileName, " copied to ", category);
  }
}

function findCategory(fileName) {
  let fileExt = path.extname(fileName);
  let extension = fileExt.slice(1);
  // console.log(extension);
  for (let type in types) {
    let curType = types[type];
    for (let i = 0; i < curType.length; i++) {
      if (curType[i] == extension) {
        return type;
      }
    }
  }
  return "others";
}

function helpFn(directoryPath) {
  console.log(`
    List of all the commands available : 
    node main.js tree "directoryPath"
    node main.js organize "directoryPath"
    node main.js help
    `);
}
// taking input
