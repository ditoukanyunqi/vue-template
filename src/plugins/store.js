import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * 约定 'store' 目录及 *.js 文件为 vuex stroe
 * 添加 namespaced: true 注册带命名空间的模块
 */
const modules = {};
const files = require.context('../views', true, /model.js$/);
const global = require.context('../store', false, /\.js$/);

files.keys().forEach((key) => {
  const dirs = key.replace(/(\.\/|\/store.js)/g, '').split('/');
  modules[dirs[dirs.length - 1]] = {
    namespaced: true,
    ...files(key).default,
  };
});

global.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = {
    namespaced: true,
    ...global(key).default,
  };
});

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
});
