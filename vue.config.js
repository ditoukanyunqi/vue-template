// var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'));
  },
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: process.env.baseUrl,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  css: {
    modules: false,
    sourceMap: true
  }
};
