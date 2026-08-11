import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import App from './App';
import ChallengeListPage from './components/ChallengeListPage';
import SubmissionsPage from './components/SubmissionsPage';
import theme from './theme';
import './styles/App.css';

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    // #region agent log
    // #endregion

    function handleGlobalError(event) {
      // #region agent log
      // #endregion
    }

    function handleUnhandledRejection(event) {
      // #region agent log
      // #endregion
    }

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hash === '#/submissions') {
    return <SubmissionsPage />;
  }
  if (hash === '#/challenges') {
    return <ChallengeListPage />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Root />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
