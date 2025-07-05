import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        position: 'fixed',
        top: '24px',
        right: '10px',
        padding: '10px 14px',
        borderRadius: '30px',
        background: darkMode ? '#ffcccb' : '#333',
        color: darkMode ? '#000' : '#fff',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
