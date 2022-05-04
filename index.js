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
      let codeError = '';
      if (result.reason.code !== 'ERR_BAD_REQUEST') {
        codeError = result.reason.code;
      } else if (result.reason.code === 'ERR_BAD_REQUEST') {
        codeError = result.reason.response.status;
      }
      linksValidated.push({
        href: link.href, file: link.file, text: link.text, status: codeError, ok: 'fail',
      });
    } else {
      linksValidated.push({
        href: link.href, file: link.file, text: link.text, status: result.value.status, ok: 'ok',
      });
    }
  });
  return linksValidated;
};

const check = (links, options) => new Promise((resolve) => {
  if (options !== undefined && typeof options === 'object') {
    if (options.validate && options.stats) {
      getPromisesHref(links).then((results) => {
        const optsObject = {
          total: links.length,
          unique: countsHref(links),
          broken: countsBroken(results),
        };
        resolve(optsObject);
      });
    } else if (options.stats) {
      const optsObject = {
        total: links.length,
        unique: countsHref(links),
      };
      resolve(optsObject);
    } else if (options.validate) {
      getPromisesHref(links).then((results) => {
        resolve(checkRequire(links, results));
      });
    } else if (options.validate === false || options.stats === false) {
      resolve(links);
    }
  } else {
    resolve(links);
  }
});

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
