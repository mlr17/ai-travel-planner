// 扩展 Window 接口以避免一些类型错误
interface Window {
  [key: string]: any;
}

// 允许导入任何模块而不会有类型错误
declare module '*';

// 为环境变量提供类型定义
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_API_URL: string;
    REACT_APP_CLAUDE_API_KEY?: string;
    REACT_APP_AMAP_API_KEY?: string;
    [key: string]: string | undefined;
  }
}

// 为 svg 导入提供类型支持
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// 为其他资源文件提供类型支持
declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.json' {
  const value: any;
  export default value;
}

// 使用 any 类型覆盖一些可能导致警告的接口
interface Activity {
  time?: string;
  title?: string;
  description?: string;
  location?: string;
  coordinates?: [number, number];
  tips?: string;
  cost?: string;
  weather?: string;
  transportation?: {
    method: string;
    duration: string;
    cost: string;
  };
  [key: string]: any;
}

interface GeneratedTrip {
  [key: string]: any;
}

interface TripFormData {
  [key: string]: any;
}

// 允许在生产环境下使用 console.*
// 通常，这些在生产环境中会被 ESLint 警告
interface Console {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
} 