const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  root: true,
  extends: ['eslint-config-airbnb', 'plugin:jest/recommended', 'prettier'],
  plugins: ['prettier', 'jest', 'react', 'json'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  settings: {
    'import/core-modules': ['enzyme'],
    'import/ignore': ['node_modules\\/(?!@storybook)'],
  },
  rules: {
    strict: [error, 'never'],
    'prettier/prettier': [
      warn,
      {
        printWidth: 100,
        tabWidth: 2,
        bracketSpacing: true,
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? error : ignore,
    quotes: [warn, 'single', { avoidEscape: true }],
    'class-methods-use-this': ignore,
    'arrow-parens': 'off',
    'space-before-function-paren': ignore,
    'import/no-unresolved': error,
    'import/extensions': [
      error,
      {
        js: 'never',
        json: 'always',
      },
    ],
    'import/no-extraneous-dependencies': [
      error,
      {
        devDependencies: [
          'examples/**',
          '**/example/**',
          '*.js',
          '**/*.test.js',
          '**/*.stories.js',
          '**/scripts/*.js',
          '**/stories/**/*.js',
          '**/__tests__/**/*.js',
        ],
        peerDependencies: true,
      },
    ],
    'import/prefer-default-export': ignore,
    'import/default': error,
    'import/named': error,
    'import/namespace': error,
    'react/prop-types': ignore,
    'react/jsx-wrap-multilines': ignore,
    'react/jsx-indent': ignore,
    'react/jsx-indent-props': ignore,
    'react/jsx-closing-bracket-location': ignore,
    'react/jsx-uses-react': error,
    'react/jsx-uses-vars': error,
    'react/react-in-jsx-scope': error,
    'react/jsx-filename-extension': [
      warn,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'jsx-a11y/accessible-emoji': ignore,
    'jsx-a11y/href-no-hash': ignore,
    'jsx-a11y/label-has-for': ignore,
    'jsx-a11y/click-events-have-key-events': error,
    'jsx-a11y/anchor-is-valid': [warn, { aspects: ['invalidHref'] }],
    'react/no-unescaped-entities': ignore,
  },
};
