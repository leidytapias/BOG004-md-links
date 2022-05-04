#!/usr/bin/env node
/* eslint-disable no-console */

const mdLinks = require('./index');

const getOptionsFromArgs = () => {
  const validate = process.argv.includes('--validate');
  const stats = process.argv.includes('--stats');
  return {
    validate,
    stats,
  };
};

const showResults = (options, result) => {
  if (options.validate && options.stats) {
    console.log(`Total: ${result.total}`);
    console.log(`Unique: ${result.unique}`);
    console.log(`Broken: ${result.broken}`);
  } else if (options.validate) {
    result.forEach((link) => {
      console.log(`${link.file} ${link.href} ${link.ok} ${link.status} ${link.text}`);
    });
  } else if (options.stats) {
    console.log(`Total: ${result.total}`);
    console.log(`Unique: ${result.unique}`);
  } else {
    result.forEach((link) => {
      console.log(`${link.file} ${link.href} ${link.text}`);
    });
  }
};

const cli = () => {
  const path = process.argv[2];
  const options = getOptionsFromArgs();
  mdLinks(path, options).then((result) => {
    showResults(options, result);
  });
};

cli();
