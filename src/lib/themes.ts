import type { ThemeValuesGlobal } from '@replit/extensions';

export function applyThemeValues(themeValues: ThemeValuesGlobal) {
  for (const [key, value] of Object.entries(themeValues)) {
    if (key == '__typename') {
      continue;
    }

    document.documentElement.style.setProperty(
      `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
      value
    );
  }
}
