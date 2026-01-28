import { describe, it, expect } from 'vitest';
import theme from '../theme';

describe('theme', () => {
  it('defines primary palette and button overrides', () => {
    expect(theme.palette.primary.main).toBe('#0066cc');
    expect(theme.components.MuiButton.styleOverrides.root.textTransform).toBe('none');
  });
});
