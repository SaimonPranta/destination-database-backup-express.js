const getDateAndTime = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (12:00 AM)

  const formattedDateTime = `${day}-${month}-${year} || ${hours}:${minutes} ${ampm}`;

  return formattedDateTime;
};

module.exports = { getDateAndTime };
