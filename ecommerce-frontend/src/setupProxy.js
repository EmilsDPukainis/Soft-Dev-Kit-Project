const { createProxyMiddleware } = require('http-proxy-middleware'); //IMPORTANT INSTALL

module.exports = function(app) {
  app.use(
    ['/api', '/api/admin', '/api/admin/login', '/api/admin/register'], 
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};