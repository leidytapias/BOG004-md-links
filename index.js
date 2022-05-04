const Path = require('path');
const getFilesWithRecursively = require('./js/recursively.js');
const { getLinks, check } = require('./js/functions.js');

const mdLinks = (path, options) => new Promise((resolve, reject) => {
  const extension = Path.extname(path);
  if (extension === '') {
    // Aqui entra porque la ruta es una carpeta ya que no tiene extensión;
    const files = getFilesWithRecursively(path);
    if (files.length === 0) {
      // Retorna una arreglo vacio si la lista de archivos esta vacia
      resolve([]);
    } else {
      // Recorrea la lista de archivos ya que no esta vacia
      let links = [];
      files.forEach((file) => {
        // Obtener los enlaces de cada archivo de la lista de archivos
        links = links.concat(getLinks(file));
      });
      check(links, options).then((result) => resolve(result));
    }
  } else if (extension === '.md') {
    // si la extension es igual a .md obtiene los enlaces de ese archivo md
    const links = getLinks(path);
    check(links, options).then((result) => resolve(result));
  } else {
    reject(Error('Envié una carpeta o un archivo .md'));
  }
});

module.exports = mdLinks;
