const parseStringToArray = (str) => {
  const array = str.split(",").filter(Boolean).map(Number);
  return array;
};

module.exports = {
  parseStringToArray,
};
