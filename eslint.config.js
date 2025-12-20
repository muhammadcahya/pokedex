//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['dist', '.wrangler', '.vercel', '.netlify', '.output', 'build/'],
  },
]
