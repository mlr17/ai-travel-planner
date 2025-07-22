import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 定义主题上下文类型
interface ThemeContextType {
  theme: string;
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件属性类型
interface ThemeProviderProps {
  children: ReactNode;
}

// 自定义钩子，用于在组件中获取主题信息
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储中获取主题，如果不存在，则默认为亮色模式
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // 切换主题的函数
  const toggleTheme = (): void => {
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
  const value: ThemeContextType = {
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
 