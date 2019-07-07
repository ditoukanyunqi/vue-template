module.exports = {
  presets: ['@vue/app'],

  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    [
      'import',
      {
        libraryName: '@fe/common-utils',
        camel2DashComponentName: false, // 是否需要驼峰转短线
        camel2UnderlineComponentName: false, // 是否需要驼峰转下划线
        customName: name => {
          console.log(name);
          return `@fe/common-utils/${name}`;
        }
      }
    ]
  ]
};
