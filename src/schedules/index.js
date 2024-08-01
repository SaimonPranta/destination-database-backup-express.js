const cron = require("node-cron");
const dbBackup = require("../schedules/db/index");

 

// Schedule a task to run instantly and then every hour
cron.schedule("0 0 * * * *", () => {  
  dbBackup();
});
dbBackup();
