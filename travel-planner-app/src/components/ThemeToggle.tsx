import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemeToggle.scss';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`theme-toggle ${className}`}>
      <input
        type="checkbox"
        id="theme-toggle"
        className="theme-toggle-checkbox"
        checked={isDark}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <span className="theme-toggle-inner">
          <span className="theme-toggle-icon">
            {isDark ? '🌙' : '☀️'}
          </span>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle; 