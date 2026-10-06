import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  astro: true,
  unocss: true,
  markdown: false,
  toml: false,
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
    // The configured test command uses Node's built-in runner.
    'test/no-import-node-test': 'off',
  },
})
