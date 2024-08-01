const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { BACKUP_SERVER_URL } = require("../../shared/constants");
const { getDateAndTime } = require("../../shared/utilities/index");
const {
  createBufferComboFile,
  moveExistingAllFiles,
} = require("./helper/utilities/index");

const localStorageFilePath = path.join(
  __dirname,
  "../../../../../../micple_db_backup.imp"
);

const serverStorageFilePath = path.join(
  __dirname,
  "../../../../../micple_db_backup.imp"
);

const backupStorageRootLocation = process?.env?.npm_lifecycle_event === "build" ? serverStorageFilePath : localStorageFilePath
 

const dbBackup = async () => {
  try {
    const assetsDBFilePath = path.join(__dirname, "../../assets/db");

    const secretCode = process.env.MICPLE_SECRET_CODE;
    const mediaFile = await axios({
      method: "get",
      url: `${BACKUP_SERVER_URL}/db/backup`,
      timeout: 60000000, // Set the timeout to 5000 milliseconds (5 seconds)
      headers: {
        "Custom-Headers": secretCode,
      },
      responseType: "arraybuffer", // Ensure the response is treated as binary data
    });
    // const mediaFile = await axios.get(`${BACKUP_SERVER_URL}/db/backup`, {
    //   headers: {
    //     "Custom-Headers": secretCode,
    //   },
    //   responseType: "arraybuffer", // Ensure the response is treated as binary data
    // });


    let bufferSize = await Buffer.from(mediaFile.data).length;
    let currentMediaSize = 0;

    const currentFolder = path.join(
      backupStorageRootLocation,
      "current_older/dump.zip"
    );

    if (fs.existsSync(assetsDBFilePath)) {
      const statFile = await fs.statSync(assetsDBFilePath);
      currentMediaSize = await statFile.size;
    }

    bufferSize = bufferSize + 10000;
    if (bufferSize >= currentMediaSize) {
      const currentBackupFolder = path.join(
        backupStorageRootLocation,
        "current_backup"
      );

      //Warning in this section step is mandatory
      await createBufferComboFile(assetsDBFilePath, "dump.zip", mediaFile.data); //1st Step

      await moveExistingAllFiles(backupStorageRootLocation); //2nd Step
      if (!fs.existsSync(currentBackupFolder)) {
        await fs.mkdirSync(currentBackupFolder);
      }
      await createBufferComboFile(
        currentBackupFolder,
        "dump.zip",
        mediaFile.data
      ); //3rd Step

      console.log("Backup Time:->", new Date());
      console.log("Micple DB backup has been complied successfully!");
    } else {
      console.log("Backup Time:->", new Date());
      console.log("Failed to backup Micple DB!");
    }
  } catch (error) {
    console.log("error: ==>> ", error);
  }
};

module.exports = dbBackup;
