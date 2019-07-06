// var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src'));
  },
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: process.env.baseUrl,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  css: {
    modules: false,
    sourceMap: true,
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
      },
    },
  },
};
