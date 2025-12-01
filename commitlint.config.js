export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [1, 'always', ['web', 'server', 'shared']], // (scope) 限定
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'perf',
        'i18n',
        'ci',
        'build',
        'revert',
        'script',
        'chore',
      ],
    ], // (type) 限定
  },
};
