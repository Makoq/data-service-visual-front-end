module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: 1708,
    proxy: {
      '/api': {
        target: 'http://localhost:8888/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },


  },
};
