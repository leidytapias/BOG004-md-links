const getFilesWithRecursively = require('./js/recursively.js');   
const Path = require("path");

const mdLinks = (path, options) => new Promise((resolve, reject) => {
   const files = getFilesWithRecursively(path);
  console.log(files);
})

mdLinks("./archivos", { validate: true });

module.exports = mdLinks;
