import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 导入字体和外部CSS
import './styles/global.scss';

// 仅在生产环境中禁用控制台警告
if (process.env.NODE_ENV === 'production') {
  // 备份原始控制台方法
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // 重写警告方法，过滤掉一些常见的 React 警告
  console.warn = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      // 忽略特定的警告消息
      const ignoredWarnings = [
        'componentWillReceiveProps has been renamed',
        'componentWillMount has been renamed',
        'componentWillUpdate has been renamed',
        'React.createFactory() is deprecated',
        'Warning: Failed prop type:',
        'Each child in a list should have a unique "key" prop',
        'Using UNSAFE_'
      ];
      
      if (ignoredWarnings.some(warning => args[0].includes(warning))) {
        return;
      }
    }
    originalWarn.apply(console, args);
  };
  
  // 重写错误方法，过滤掉一些常见的 React 错误
  console.error = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      // 忽略特定的错误消息
      const ignoredErrors = [
        'Warning: Failed prop type:',
        'Warning: Each child in a list should have a unique "key" prop',
        'Invalid hook call'
      ];
      
      if (ignoredErrors.some(error => args[0].includes(error))) {
        return;
      }
    }
    originalError.apply(console, args);
  };
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
