import express from 'express';
import cors from 'cors';
import tripRoutes from './routes/tripRoutes';
import config from './config/config';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/trips', tripRoutes);

// 根路由健康检查
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'travel-planner-server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
const startServer = async () => {
  try {
    const PORT = await config.findAvailablePort(Number(config.port));
    app.listen(PORT, () => {
      console.log(`服务器已启动: http://localhost:${PORT}`);
      console.log('环境配置:', {
        port: PORT,
        anthropicBaseURL: config.anthropic.baseURL,
        amapAPIKey: config.amap.apiKey ? '已配置' : '未配置',
        mcpServerPath: config.mcpServer.path
      });
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer(); 