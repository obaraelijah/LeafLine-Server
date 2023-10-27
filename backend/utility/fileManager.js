// Basic Lib Imports
const fs = require("fs");

//ensure that the uploaded files have the correct file extensions
const handleFileUpload = (req) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  return newPath;
};

module.exports = handleFileUpload;