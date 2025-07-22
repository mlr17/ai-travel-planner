const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 如果需要代理 Claude API 请求到后端
  app.use(
    '/api/claude',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/claude': '/v1'
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      logLevel: 'debug'
    })
  );

  // 如果需要代理高德地图 API 请求到后端
  app.use(
    '/api/amap',
    createProxyMiddleware({
      target: 'https://restapi.amap.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/amap': '/v3'
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      logLevel: 'debug'
    })
  );

  // 如果您有本地服务器，添加这个代理
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
}; 