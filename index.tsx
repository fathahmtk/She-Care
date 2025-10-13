import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Moved the global JSX type definition for 'model-viewer' to the main entry point.
// Augmenting the JSX namespace here ensures that TypeScript correctly loads and merges
// this custom element with the standard HTML elements from React's types, resolving
// widespread "Property 'div' does not exist" errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          cameraControls?: boolean;
          autoRotate?: boolean;
          shadowIntensity?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
