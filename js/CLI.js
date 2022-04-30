const axios = require('axios');
const mdLinks = require('../index.js');

const countsHref = (links) => {
  // en este objeto se guarda el nuevo objeto
  const counts = {};

  links.forEach((link) => {
    axios.get(link)
      .then((response) => {
        console.log(response.status);
        if (response.status === 'fulfilled') {
          console.log(response.status);
        }
      });

    // aqui se cuenta cuantos href se encuentran y
    // por cada recorrido se sumara cuantas veces en cuentre el mismo href
    counts[link.href] = (counts[link.href] || 0) + 1;
  });
  console.log(counts);

  // aqui etorna los href de los objetos
  // las veces que este repetido y si solo esta una vez lo agrega en un array
  const getArrayHrefsWithCount = (object, value) => {
    Object.keys(object).filter((key) => object[key] === value);
  };
  const uniqueArray = getArrayHrefsWithCount(counts, 1);
  return uniqueArray.length;
};
const check = (links, options) => {
  if (options !== undefined && typeof options === 'object') {
    if (options.validate && options.stats) {
      countsHref(links);
    } else if (options.stats) {
      console.log('aqui entro');
    } else if (options.validate) {
      console.log('hacer peticion HTTP para verificar');
    }
  }
};
check();
mdLinks();
// importar mgLinks y utilizarla;
