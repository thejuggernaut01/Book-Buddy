const getMsgForPath = (errorArray, path) => {
  for (const error of errorArray) {
    if (error.path === path) {
      return error.msg;
    }
  }
  return null;
};

module.exports = getMsgForPath;
