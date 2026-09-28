// Xboard 主题模式下静态资源位于 /theme/<主题名>/，需在加载其他模块前修正 webpack 公共路径
if (typeof window !== 'undefined' && window.EZ_THEME && window.EZ_THEME.assetsPath) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.EZ_THEME.assetsPath.replace(/\/?$/, '/');
}
