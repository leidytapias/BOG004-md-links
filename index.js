const Path = require('path');
const { readFileSync } = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios');
const getFilesWithRecursively = require('./js/recursively.js');

const getLinks = (file) => {
  const markdown = readFileSync(file, { encoding: 'utf8' });
  const { links } = markdownLinkExtractor(markdown, true);
  // transformar los enlaces solo con las 3 propiedades,
  // ya que links tiene muchas propiedades que no se usuaran
  const transformedLinks = links.map((link) => (
    {
      href: link.href,
      text: link.text,
      file,
    }
  ));
  return transformedLinks;
};

const countsHref = (links) => {
  // en este objeto se guarda el nuevo objeto
  const counts = {};
  links.forEach((link) => {
    counts[link.href] = (counts[link.href] || 0) + 1;
  });
  // aqui etorna los href de los objetos
  // las veces que este repetido y si solo esta una vez lo agrega en un array
  // eslint-disable-next-line max-len
  const getArrayHrefsWithCount = (object, value) => Object.keys(object).filter((key) => object[key] === value);
  const uniqueArray = getArrayHrefsWithCount(counts, 1);
  return uniqueArray.length;
};

const getPromisesHref = (links) => {
  const arrayPromiseArray = [];
  links.forEach((link) => {
    arrayPromiseArray.push(axios.get(link.href));
  });
  return Promise.allSettled(arrayPromiseArray);
};

const countsBroken = (results) => {
  let countsRejected = 0;
  results.forEach((result) => {
    if (result.status === 'rejected') {
      countsRejected += 1;
    }
  });
  return countsRejected;
};
const checkRequire = (links, results) => {
  const linksValidated = [];
  links.forEach((link, indexlink) => {
    const result = results[indexlink];
    if (result.status === 'rejected') {
      linksValidated.push({
        href: link.href, file: link.file, text: link.text, status: 500, ok: 'fail',
      });
    } else {
      linksValidated.push({
        href: link.href, file: link.file, text: link.text, status: result.value.status, ok: 'ok',
      });
    }
  });
  console.log('--------------------------');
  console.log(linksValidated);
  return linksValidated;
};

const check = (links, options) => {
  if (options !== undefined && typeof options === 'object') {
    if (options.validate && options.stats) {
      getPromisesHref(links).then((results) => {
        const optsObject = {
          total: links.length,
          unique: countsHref(links),
          broken: countsBroken(results),
        };
        console.log(optsObject);
      });
    } else if (options.stats) {
      const optsObject = {
        total: links.length,
        unique: countsHref(links),
      };
      console.log(optsObject);
    } else if (options.validate) {
      getPromisesHref(links).then((results) => {
        checkRequire(links, results);
      });
      console.log('hacer peticion HTTP para verificar');
    } else {
      console.log('No hay options');
    }
  }
};

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
      check(links, options);
    }
  } else if (extension === '.md') {
    // si la extension es igual a .md obtiene los enlaces de ese archivo md
    const links = getLinks(path);
    check(links, options);
  } else {
    reject(Error('Envié una carpeta o un archivo .md'));
  }
});

// mdLinks('./archivos', { validate: true, stats: false });
// mdLinks('./archivos', { validate: true, stats: true });
// mdLinks('./archivos', { validate: false, stats: true });
// mdLinks('./archivos', { validate: false, stats: false });
mdLinks('./archivos', { validate: true });
// mdLinks('./archivos', { validate: false });
// mdLinks('./archivos', { stats: true });
// mdLinks('./archivos', { stats: false });
// mdLinks('./archivos');
module.exports = mdLinks;
