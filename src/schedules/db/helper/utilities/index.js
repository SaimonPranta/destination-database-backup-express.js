const { spawn } = require("child_process");
const { folderFlow } = require("./../constants/index");
const fs = require("fs");
const path = require("path");
const { getDateAndTime } = require("../../../../shared/utilities");

// Helper function to promisify child_process.spawn
const spawnPromise = (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    child.stdout.on("data", (data) => {
      console.log("stdout: ==>>", Buffer.from(data).toString());
    });

    child.stderr.on("data", (data) => {
      console.log("stderr: ==>>", Buffer.from(data).toString());
    });

    child.on("error", (error) => {
      console.log("error: ==>>", Buffer.from(error).toString());
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Child process exited with code ${code}`);
      }
    });
  });
};

const createFileWithBuffer = (filePath, buffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(filePath, buffer);
    if (fs.existsSync(filePath)) {
      resolve();
    }
    reject("Failed to save the file");
  });
};

const createBufferComboFile = (rootPath, fileName, buffer) => {
  return new Promise((resolve, reject) => {
    const fullFilePath = path.join(rootPath, fileName);
    createFileWithBuffer(fullFilePath, buffer);
    if (!fs.existsSync(fullFilePath)) {
      reject("Failed to save the file");
    }
    createFileWithBuffer(`${rootPath}/readme.md`, getDateAndTime());
    resolve();
  });
};

const moveExistingFiles = (
  rootPath,
  sourceFolderName,
  destinationFolderName,
  fileName
) => {
  return new Promise((resolve, reject) => {
    const destinationFolderPath = path.join(rootPath, destinationFolderName);
    const sourceFilePath = path.join(rootPath, sourceFolderName, fileName);
    const destinationFilePath = path.join(
      rootPath,
      destinationFolderName,
      fileName
    );
 
    if (!fs.existsSync(destinationFolderPath)) {
      fs.mkdirSync(destinationFolderPath);
    } 
    if (fs.existsSync(sourceFilePath)) {
      fs.renameSync(sourceFilePath, destinationFilePath);
    }
    resolve();
  });
};
const moveExistingAllFiles = (rootPath) => {
  const folderName = Object.keys(folderFlow);
  const reverseFolderName = folderName.reverse();

  return Promise.all(
    reverseFolderName.map((sourceFolderName) => {
      const dump = "dump.zip";
      const dateFile = "readme.md";
      const destinationFolderName = folderFlow[sourceFolderName]; 
      moveExistingFiles(
        rootPath,
        sourceFolderName,
        destinationFolderName,
        dump
      );
      moveExistingFiles(
        rootPath,
        sourceFolderName,
        destinationFolderName,
        dateFile
      );
    })
  );
};

module.exports = { spawnPromise, createBufferComboFile, moveExistingAllFiles };
