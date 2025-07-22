// 浏览器环境配置测试

// 使用控制台输出检查环境变量
console.log('测试浏览器环境配置...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
console.log('REACT_APP API URL:', process.env.REACT_APP_API_URL);

// 测试 DOM API 是否可用
if (typeof window !== 'undefined') {
  console.log('DOM API 可用:');
  console.log('- window:', window ? '存在' : '不存在');
  console.log('- document:', document ? '存在' : '不存在');
  console.log('- localStorage:', localStorage ? '存在' : '不存在');
  console.log('- sessionStorage:', sessionStorage ? '存在' : '不存在');
  console.log('- navigator:', navigator ? '存在' : '不存在');
} else {
  console.log('DOM API 不可用，这可能是在 Node.js 环境中运行');
}

// 输出 TypeScript 配置相关环境变量
console.log('TypeScript 配置:');
console.log('- TSC_COMPILE_ON_ERROR:', process.env.TSC_COMPILE_ON_ERROR);
console.log('- ESLINT_NO_DEV_ERRORS:', process.env.ESLINT_NO_DEV_ERRORS);

console.log('浏览器环境配置测试完成');

// 这个文件会在浏览器环境中运行，用于验证配置是否正确
// 可以在浏览器控制台中查看输出结果 