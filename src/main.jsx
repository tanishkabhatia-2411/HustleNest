import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Context Providers — wrap the entire app so all components can access shared state
// The order matters: ThemeProvider is outermost so it can affect all UI
// AuthProvider provides user state
// JobsProvider and ApplicationsProvider provide job/application data
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { JobsProvider } from './context/JobsContext.jsx';
import { ApplicationsProvider } from './context/ApplicationsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <JobsProvider>
            <ApplicationsProvider>
              <App />
            </ApplicationsProvider>
          </JobsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
