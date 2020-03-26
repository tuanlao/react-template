/* eslint-disable global-require, no-restricted-syntax, guard-for-in */
require('@babel/polyfill');
require('shelljs/global');

const fs = require('fs');
const nodeGlob = require('glob');
const path = require('path');

const { appLocales } = require('i18n');

const animateProgress = require('./helpers/progress');
const addCheckmark = require('./helpers/checkmark');

// Glob to match all js files except test files
const FILES_TO_PARSE = 'app/**/messages.js';

const newLine = () => process.stdout.write('\n');

// Progress Logger
let progress;
const task = message => {
  progress = animateProgress(message);
  process.stdout.write(message);

  return error => {
    if (error) {
      process.stderr.write(error);
    }
    clearTimeout(progress);
    return addCheckmark(() => newLine());
  };
};

// Wrap async functions below into a promise
const glob = pattern =>
  new Promise((resolve, reject) => {
    nodeGlob(
      pattern,
      (error, value) => (error ? reject(error) : resolve(value)),
    );
  });

// Store existing translations into memory
const localeMappings = [];

// Loop to run once per locale
for (const locale of appLocales) {
  localeMappings[locale] = {};
}

const extractFromFile = async filename => {
  try {
    const messages = require(path.resolve(filename)).default;
    for (const key in messages) {
      const message = messages[key];
      for (const locale of appLocales) {
        localeMappings[locale][message.id] = message[locale] || message.defaultMessage;
      }
    }
  } catch (error) {
    process.stderr.write(`\nError transforming file: ${filename}\n${error}\n`);
  }
};

const memoryTask = glob(FILES_TO_PARSE);
const memoryTaskDone = task('Storing language files in memory');

memoryTask.then(files => {
  memoryTaskDone();

  const extractTask = Promise.all(
    files.map(fileName => extractFromFile(fileName)),
  );
  const extractTaskDone = task('Run extraction on all files');
  // Run extraction on all files that match the glob on line 16
  extractTask.then(() => {
    extractTaskDone();

    // Make the directory if it doesn't exist, especially for first run
    mkdir('-p', 'app/translations'); // eslint-disable-line

    let localeTaskDone;
    let translationFileName;

    for (const locale of appLocales) {
      translationFileName = `app/translations/${locale}.json`;
      localeTaskDone = task(
        `Writing translation messages for ${locale} to: ${translationFileName}`,
      );

      // Sort the translation JSON file so that git diffing is easier
      // Otherwise the translation messages will jump around every time we extract
      const messages = {};
      Object.keys(localeMappings[locale])
        .sort()
        .forEach(key => {
          messages[key] = localeMappings[locale][key];
        });

      // Write to file the JSON representation of the translation messages
      const prettified = `${JSON.stringify(messages, null, 2)}\n`;

      try {
        fs.writeFileSync(translationFileName, prettified);
        localeTaskDone();
      } catch (error) {
        localeTaskDone(
          `There was an error saving this translation file: ${translationFileName}
          \n${error}`,
        );
      }
    }

    process.exit();
  });
});
