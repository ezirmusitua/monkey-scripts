const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  return `Date: ${year}-${month + 1}-${date}[${hour}:${minute > 9 ? minute : '0' + minute}]`;
};

module.exports = {
  formatDate: formatDate,
};
