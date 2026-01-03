import type { ThemeConfig } from './types'

export function generateThemeCSS(config: ThemeConfig): string {
  return `/* Add these attributes to your <html> tag */
<html
  data-theme="${config.theme}"
  data-surface="${config.surface}"
>

/* Or update your existing CSS variables */
:root {
  --radius: ${config.radius}rem;
}

/*
  Your theme is now configured!

  Current settings:
  - Primary Color: ${config.theme}
  - Surface Color: ${config.surface}
  - Border Radius: ${config.radius}rem

  The data-theme and data-surface attributes automatically
  map to CSS variables defined in your styles.css file.

  To change these values programmatically:
  1. Update the data-theme attribute:
     document.documentElement.setAttribute('data-theme', '${config.theme}')

  2. Update the data-surface attribute:
     document.documentElement.setAttribute('data-surface', '${config.surface}')

  3. Update the radius variable:
     document.documentElement.style.setProperty('--radius', '${config.radius}rem')
*/`
}
