const mdLinks = require('../index.js');
const getFilesRecursively = require('../js/recursively.js');

jest.mock('fs');

describe('mdLinks', () => {
  it('should...', () => {
    console.log(mdLinks);
  });
});
describe('exite el archivo o es un directorio', () => {
  test('es una carpeta o es un directorio', () => {
    getFilesRecursively().then((files) => {
      expect(files).toBe('carpetas o archivos');
    });
  });
});
describe('obtener links', () => {
  it('obtener capertas de mdlinks', () => {
    const files = getFilesRecursively('./archivos');
    expect(getFilesRecursively(files)).toBe('links');
  });
});
