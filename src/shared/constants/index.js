// const BACKUP_SERVER_URL =  "https://plmqazoknwsxijbedcuhvrfygt.dbbackup.micple.com";
// const BACKUP_SERVER_URL = "http://localhost:5000";
const BACKUP_SERVER_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://plmqazoknwsxijbedcuhvrfygt.dbbackup.micple.com";
 
module.exports = { BACKUP_SERVER_URL };
