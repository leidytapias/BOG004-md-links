const getFilesWithRecursively = require('./js/recursively.js');
const Path = require("path");
const { readFileSync } = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');

const mdLinks = (path, options) => new Promise((resolve, reject) => {
  const extension = Path.extname(path);
  if (extension === '') {
    // Aqui entra porque la ruta es una carpeta ya que no tiene extensión 
    const files = getFilesWithRecursively(path);
    if (files.length === 0) {
      // Retorna una arreglo vacio si la lista de archivos esta vacia
      resolve([]);
    } else {
      // Recorrea la lista de archivos ya que no esta vacia
      files.forEach((file) => {
        // Obtener los enlaces de cada archivo de la lista de archivos
        const links = getLinks(file);
      });
    }
  } else if (extension === '.md') {
    // si la extension es igual a .md obtiene los enlaces de ese archivo md
    const links = getLinks(path);
  } else {
    reject('Envié una carpeta o un archivo .md')
  }

});


const getLinks = (file) => {
  const markdown = readFileSync(file, { encoding: 'utf8' });
  const { links } = markdownLinkExtractor(markdown, true);
  return links;
}



mdLinks("./archivos", { validate: true, stats: false });

module.exports = mdLinks;
