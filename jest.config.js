module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/*/RbGenerated*/*.{js,jsx}',
    '!app/app.js',
    '!app/global-styles.js',
    '!app/*/*/Loadable.{js,jsx}',
  ],
  moduleDirectories: ['node_modules', 'app'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.js',
    'react-testing-library/cleanup-after-each',
  ],
  setupFiles: ['raf/polyfill'],
  testMatch: ['<rootDir>/app/**/tests/*.test.{js,jsx}'],
  transform: { '\\.(js|jsx)$': 'babel-jest' },
  restoreMocks: true,
  watchPlugins: [
    'jest-watch-suspend',
    ['jest-watch-toggle-config', { setting: 'bail' }],
    ['jest-watch-toggle-config', { setting: 'collectCoverage' }],
    ['jest-watch-toggle-config', { setting: 'notify' }],
    ['jest-watch-toggle-config', { setting: 'verbose' }],
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/certificates',
    '<rootDir>/coverage',
    '<rootDir>/docs',
    '<rootDir>/fastlane',
    '<rootDir>/flow-typed',
    '<rootDir>/infrasturcture',
    '<rootDir>/internals',
    '<rootDir>/node_modules',
    '<rootDir>/platforms',
    '<rootDir>/plugins',
    '<rootDir>/scripts',
    '<rootDir>/server',
    '<rootDir>/www',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
  errorOnDeprecated: true,
};