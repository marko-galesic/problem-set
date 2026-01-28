import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0066cc' },
    success: { main: '#0e7c0e' },
    info: { main: '#0e639c' },
    warning: { main: '#7a4d00' },
    error: { main: '#be1100' },
    background: { default: '#ffffff', paper: '#ffffff' }
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', " +
      "'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    button: { textTransform: 'none' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 0
        }
      }
    }
  }
});

export default theme;
