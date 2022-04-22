const Fs = require('fs');
const Path = require('path')

const getFilesRecursively = (files, directory) => {
  // obtener archivos y subcarpetas de la carpeta
  const filesInDirectory = Fs.readdirSync(directory);
  // Iterar cada uno de los archivos de la carpeta
  for (const file of filesInDirectory) {
    // Obtener la ruya absoluta del archivo
    const absolute = Path.join(directory, file);
    // Verificar si la ruta absoluta es una carpeta o un archivo
    if (Fs.statSync(absolute).isDirectory()) {
      // Si es una carpeta se vuelve a llamar la función con la ruta absoluta de esa carpeta interna
      getFilesRecursively(files, absolute);
    } else {
      // Si es un archivo se agrega al arreglo de archivos
      // ****** Falta agregar validacion de que solo se agreguen archivos .md ******
      files.push(absolute);
    }
  }
};

const getFilesWithRecursively = (path) => {
  const files = [];
  getFilesRecursively(files, path);
  return files;
}

module.exports = getFilesWithRecursively;
