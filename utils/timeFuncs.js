function convertToLocalTimezone(date) {
    const dateObject = new Date(date);
    // Format the date manually to get 'yyyy-mm-dd' format
    const formattedDate = `${dateObject.getFullYear()}-${("0" + (dateObject.getMonth() + 1)).slice(-2)}-${("0" + dateObject.getDate()).slice(-2)}`;
    return formattedDate;
}

module.exports = { convertToLocalTimezone };