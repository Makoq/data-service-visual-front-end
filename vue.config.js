module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: '1708',
    proxy: {
      '/api': {
        target: 'http://localhost:8897/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
      '/te': {
        target: 'http://localhost:8899/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/te': '/',
        },
      },
      '/pd': {
        target: 'http://111.229.14.128:8899/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/pd': '/',
        },
      },


    },


  },
};
