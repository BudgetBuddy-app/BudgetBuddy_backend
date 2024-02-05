function convertToLocalTimezone(date) {
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: timezone };
    return new Date(date).toLocaleString('en-UK', options);
}

module.exports = { convertToLocalTimezone };