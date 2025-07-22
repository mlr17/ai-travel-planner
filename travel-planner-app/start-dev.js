#!/usr/bin/env node

// 用于启动开发服务器的脚本，设置环境变量以减少警告
const { spawn } = require('child_process');
const path = require('path');

// 设置环境变量
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.FAST_REFRESH = 'true';
process.env.CI = 'false';
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';

// 启动 React 开发服务器
console.log('启动 React 开发服务器，已设置环境变量以减少警告...');
const startCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const reactProcess = spawn(startCmd, ['start'], {
  stdio: 'inherit',
  env: process.env
});

reactProcess.on('close', (code) => {
  console.log(`React 开发服务器已退出，退出码: ${code}`);
});

// 处理终止信号
process.on('SIGINT', () => {
  console.log('收到终止信号，正在关闭开发服务器...');
  reactProcess.kill();
  process.exit(0);
}); 