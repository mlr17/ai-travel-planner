import React, { createContext, useState, useEffect, useContext } from 'react';

// 创建主题上下文
const ThemeContext = createContext();

// 自定义钩子，用于在组件中获取主题信息
export const useTheme = () => useContext(ThemeContext);

// 主题提供者组件
export const ThemeProvider = ({ children }) => {
  // 从本地存储中获取主题，如果不存在，则默认为亮色模式
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  // 当主题改变时，更新本地存储和文档数据属性
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 提供主题上下文值
  const value = {
    theme,
    isDarkTheme: theme === 'dark',
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 