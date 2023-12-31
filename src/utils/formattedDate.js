module.exports = function formattedDate(date) {
    if (!(date instanceof Date)) {
      return undefined;
    }
  
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    let year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};
