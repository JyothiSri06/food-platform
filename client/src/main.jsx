import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

console.log("main.jsx: Bootstrapping application...");
console.log("Current Origin:", window.location.origin);
console.log("Client ID (first 20 chars):", clientId?.substring(0, 20));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find root element with id 'root'");
}

// NOTE: StrictMode is removed to prevent double-initialization of Google Sign-In library
// which can cause "origin not allowed" errors due to state poisoning in development.
createRoot(rootElement).render(
  <>
    {clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </>
);
