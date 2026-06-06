import React from 'react';
import Home from './pages/Home';

/**
 * App component that wraps the main layout and renders the Home page.
 */
export default function App() {
  return (
    <div className="w-full min-h-screen bg-base-100 text-gray-100">
      <Home />
    </div>
  );
}
