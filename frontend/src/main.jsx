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
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.jsx:Root:mount',message:'Root mounted',data:{hash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
    // #endregion

    function handleGlobalError(event) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.jsx:window.onerror',message:'window error',data:{message:event?.message||'unknown',filename:event?.filename||'unknown',lineno:event?.lineno||0,colno:event?.colno||0},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    }

    function handleUnhandledRejection(event) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.jsx:window.onunhandledrejection',message:'unhandled rejection',data:{reason:event?.reason ? String(event.reason) : 'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'J'})}).catch(()=>{});
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
