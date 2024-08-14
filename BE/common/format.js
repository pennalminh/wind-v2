const parseStringToArray = (str) => {
  // Tách chuỗi thành các phần tử dựa trên dấu phẩy
  const array = str.split(",").filter(Boolean).map(Number);
  return array;
};

module.exports = {
  parseStringToArray,
};
