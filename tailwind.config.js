/**
 * Tailwind do site, compilado (antes vinha do cdn.tailwindcss.com no navegador).
 *
 * Por que compilar: o CDN e um script de terceiro carregado antes de qualquer
 * consentimento (o IP do visitante ia para la), o proprio Tailwind avisa no
 * console que ele nao serve para producao, e qualquer troca do lado deles
 * mudaria o site sem commit nosso. O tema abaixo e o mesmo que estava inline
 * no index.html.
 *
 *   npm install && npm run build:css   ->  assets/css/tailwind.css
 *
 * Mexeu em classe de algum HTML? Rode o build e commite o CSS junto: o GitHub
 * Pages serve o repositorio como esta, sem passo de build.
 */
module.exports = {
  content: ['./*.html', './*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-primary-fixed': '#001a3f',
        'on-primary-fixed-variant': '#32476d',
        'on-secondary-fixed-variant': '#93000d',
        'tertiary-container': '#001a41',
        primary: '#000000',
        'on-secondary-fixed': '#410002',
        'on-tertiary-container': '#2480ff',
        background: '#f7f9fb',
        'on-primary': '#ffffff',
        'surface-container-highest': '#e0e3e5',
        'surface-bright': '#f7f9fb',
        'secondary-container': '#e51d24',
        'surface-variant': '#e0e3e5',
        'surface-dim': '#d8dadc',
        'inverse-primary': '#b2c7f5',
        'on-surface-variant': '#44474e',
        'on-surface': '#191c1e',
        'on-tertiary-fixed': '#001a41',
        error: '#ba1a1a',
        secondary: '#bb0014',
        'primary-fixed-dim': '#b2c7f5',
        'on-error': '#ffffff',
        'surface-container': '#eceef0',
        'secondary-fixed': '#ffdad6',
        'secondary-fixed-dim': '#ffb4ac',
        'primary-fixed': '#d7e2ff',
        'on-background': '#191c1e',
        'primary-container': '#001a3f',
        'tertiary-fixed': '#d8e2ff',
        'tertiary-fixed-dim': '#adc6ff',
        outline: '#74777f',
        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'on-error-container': '#93000a',
        'inverse-on-surface': '#eff1f3',
        'surface-container-low': '#f2f4f6',
        'on-primary-container': '#6f84ae',
        'surface-container-lowest': '#ffffff',
        'surface-tint': '#4a5e87',
        'surface-container-high': '#e6e8ea',
        'error-container': '#ffdad6',
        'inverse-surface': '#2d3133',
        'on-tertiary-fixed-variant': '#004493',
        'outline-variant': '#c4c6cf',
        surface: '#f7f9fb',
        'on-secondary-container': '#fffbff',
        'on-secondary': '#ffffff',
      },
      borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
      spacing: {
        'container-max': '1440px',
        'gutter-sm': '16px',
        base: '4px',
        'margin-desktop': '48px',
        'gutter-md': '24px',
        'margin-mobile': '16px',
      },
      fontFamily: {
        'display-lg': ['Montserrat'],
        'headline-lg-mobile': ['Montserrat'],
        'label-md': ['Inter'],
        caption: ['Inter'],
        'body-lg': ['Inter'],
        'headline-lg': ['Montserrat'],
        'body-md': ['Inter'],
        'headline-md': ['Montserrat'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'label-md': ['14px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
