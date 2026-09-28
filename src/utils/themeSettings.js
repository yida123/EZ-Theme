/**
 * Xboard 主题模式支持
 * 作为 Xboard 主题部署时，dashboard.blade.php 会注入 window.EZ_THEME，
 * 其中 config 为后台「主题配置」中保存的值，这里将其合并到 EZ_CONFIG
 *
 * 注意：本文件在 EZ_CONFIG 加载前就会被引入，不要引用 baseConfig
 */

const getTheme = () => (typeof window !== 'undefined' ? window.EZ_THEME : null);

export const isXboardTheme = () => !!getTheme();

// 平台字段与 CLIENT_CONFIG.clientLinks 的对应关系
export const CLIENT_PLATFORMS = ['windows', 'macos', 'android', 'ios', 'linux', 'openwrt'];

/**
 * 获取 public 目录下静态文件的地址
 * 独立部署时相对于站点根目录，主题模式下位于 /theme/<主题名>/
 */
export const getAssetUrl = (path) => {
  const theme = getTheme();
  const base = theme && theme.assetsPath ? theme.assetsPath.replace(/\/?$/, '/') : '/';
  return base + String(path).replace(/^\.?\//, '');
};

// 优先使用 Xboard 后台「站点 Logo」，未设置时使用主题自带 Logo
export const getLogoUrl = () => {
  const theme = getTheme();
  return (theme && theme.logo) || getAssetUrl('images/logo.png');
};

/**
 * 解析后台填写的客户端列表，每行一个：名称|说明|下载链接
 * 说明可省略：名称|下载链接
 */
export const parseClientLines = (text) => {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('|').map(part => part.trim());
      const url = parts.pop();
      const [name = '', desc = ''] = parts;
      return { name: name || url, desc, url };
    })
    .filter(client => /^https?:\/\//i.test(client.url));
};

const isFilled = (value) => typeof value === 'string' && value.trim() !== '';

export function applyThemeSettings(config) {
  const theme = getTheme();
  if (!theme || !config) return config;

  const settings = theme.config || {};

  // 与 Xboard 同域部署，直接使用当前域名下的 /api/v1
  config.PANEL_TYPE = 'Xboard';
  config.API_MIDDLEWARE_ENABLED = false;
  config.API_CONFIG = {
    ...config.API_CONFIG,
    urlMode: 'auto',
    autoConfig: {
      ...(config.API_CONFIG && config.API_CONFIG.autoConfig),
      useSameProtocol: true,
      appendApiPath: true,
      apiPath: '/api/v1'
    }
  };

  // 站点名称与描述沿用 Xboard 后台「站点设置」
  config.SITE_CONFIG = { ...config.SITE_CONFIG };
  if (isFilled(theme.title)) config.SITE_CONFIG.siteName = theme.title;
  if (isFilled(theme.description)) config.SITE_CONFIG.siteDescription = theme.description;

  const landingPage = config.SITE_CONFIG.customLandingPage;
  if (isFilled(landingPage) && !/^https?:\/\//i.test(landingPage)) {
    config.SITE_CONFIG.customLandingPage = getAssetUrl(landingPage);
  }

  // 客户端下载：每个平台的第一个客户端作为仪表盘下载按钮的链接
  const clients = {};
  config.CLIENT_CONFIG = { ...config.CLIENT_CONFIG };
  config.CLIENT_CONFIG.clientLinks = { ...config.CLIENT_CONFIG.clientLinks };
  CLIENT_PLATFORMS.forEach(platform => {
    const list = parseClientLines(settings[`clients_${platform}`]);
    clients[platform] = list;
    if (list.length > 0) {
      config.CLIENT_CONFIG.clientLinks[platform] = list[0].url;
    }
  });
  config.LANDING_CLIENTS = clients;

  // 客服系统代码，留空则关闭（Xboard 会将空值保存为 null）
  if (Object.prototype.hasOwnProperty.call(settings, 'customer_service_html')) {
    const html = (settings.customer_service_html || '').trim();
    config.CUSTOMER_SERVICE_CONFIG = {
      ...config.CUSTOMER_SERVICE_CONFIG,
      enabled: html !== '',
      customHtml: html
    };
  }

  return config;
}
