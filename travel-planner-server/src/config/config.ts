import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import net from 'net';

// 加载环境变量
dotenv.config();

// 获取项目根目录
const rootDir = path.resolve(__dirname, '../../..');

// 检查端口是否可用
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    server.on('error', () => {
      resolve(false);
    });
  });
};

// 寻找可用端口
const findAvailablePort = async (startPort: number = 3001): Promise<number> => {
  for (let port = startPort; port < startPort + 10; port++) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  throw new Error(`无法找到可用端口，已尝试 ${startPort} 到 ${startPort + 9}`);
};

// 查找 MCP 服务器路径
const findMCPServerPath = (): string => {
  const possiblePaths = [
    // 环境变量中的路径
    process.env.MCP_SERVER_PATH,
    
    // 当前项目中的路径
    path.resolve(__dirname, '../../node_modules/@amap/amap-maps-mcp-server/build/index.js'),
    
    // 客户端项目中的路径
    path.resolve(rootDir, 'travel-planner-app/node_modules/@amap/amap-maps-mcp-server/build/index.js'),
    path.resolve(rootDir, 'travel-planner-app/node_modules/@amap/amap-maps-mcp-server/dist/index.js'),
    
    // 父目录的其他可能位置
    path.resolve(rootDir, 'node_modules/@amap/amap-maps-mcp-server/build/index.js'),
    path.resolve(rootDir, 'node_modules/@amap/amap-maps-mcp-server/dist/index.js')
  ];

  // 筛选出存在的路径
  const existingPaths = possiblePaths.filter(p => p && fs.existsSync(p));
  
  console.log('搜索 MCP 服务器路径...');
  if (existingPaths.length > 0) {
    console.log('找到可用的 MCP 服务器路径:', existingPaths[0]);
    return existingPaths[0];
  }

  // 如果没有找到，返回默认路径并输出警告
  console.warn('警告: 未找到可用的 MCP 服务器路径，使用默认路径');
  return path.resolve(rootDir, 'travel-planner-app/node_modules/@amap/amap-maps-mcp-server/build/index.js');
};

const config = {
  port: process.env.PORT || 3001,
  findAvailablePort,
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || 'sk-dEINDswhyUiRYYtMeJ6prw0DzuNWkqGyxXG2xu6H2zwN8KMz',
    baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.cursorai.art',
  },
  amap: {
    apiKey: process.env.AMAP_MAPS_API_KEY || '389a1229b6e48e1040da4b6f8f0d2a46',
  },
  mcpServer: {
    path: findMCPServerPath(),
    // 备用机制：如果无法连接 MCP 服务器，仍能提供基本的行程生成功能
    enableFallback: true
  }
};

export default config; 