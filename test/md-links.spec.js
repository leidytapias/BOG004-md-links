// const getFilesRecursively = require('../js/recursively.js');
// const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios');
const {
  getLinks,
  countsHref,
  getPromisesHref,
  countsBroken,
  // checkRequire,
  // check,
} = require('../js/functions.js');

jest.mock('markdown-link-extractor', () => jest.fn().mockImplementation(() => ({
  links: [
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown1',
      route: '',
      direction: 'calle',
    },
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown2',
      route: '',
      direction: 'calle',
    },
  ],
})));
jest.mock('fs');
jest.mock('axios');

describe('Pruebas para las funciones del archivo functions.js', () => {
  test('Deberia obtenerme links', () => {
    const fileMd = './archivos/md1.md';
    const fileResult = getLinks(fileMd);
    const arrayResult = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown1',
        file: fileMd,
      },
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown2',
        file: fileMd,
      },
    ];
    expect(fileResult).toEqual(arrayResult);
  });

  test('Deberia contar los href unicos', () => {
    const countUnique = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
      },
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
      },
      {
        href: 'https://www.facebook.com',
      },
    ];
    const uniqueQuantity = countsHref(countUnique);
    expect(uniqueQuantity).toBe(1);
  });

  test('debe devolver un array', () => {
    axios.get.mockImplementation(() => Promise.resolve([]));
    const promises = getPromisesHref([{ href: 'https://www.facebook.com' }]);
    promises.then((links) => {
      expect(links).toHaveLength(1);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  });

  test('Deberia obtener la suma de objetos iguales', () => {
    const count = [{ status: 'rejected' }, { status: 'fullfilled' }];
    expect(countsBroken(count)).toBe(1);
  });
});
