import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  astro: true,
  unocss: true,
  markdown: false,
  toml: false,
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
