/**
 * Xboard 人机验证适配
 * Xboard 通过 captcha_type 区分 recaptcha / turnstile / recaptcha-v3，
 * 各类型的站点密钥与后端校验参数名都不同，这里统一转换成主题原有的格式
 */

// 需要携带人机验证参数的 Xboard 接口
const CAPTCHA_PATHS = ['/passport/auth/register', '/passport/comm/sendEmailVerify'];

let captchaState = {
  enabled: false,
  type: 'recaptcha',
  siteKey: ''
};

let recaptchaV3Loader = null;

/**
 * 规范化 /guest/comm/config 返回的数据，使页面沿用 is_recaptcha / recaptcha_site_key 逻辑
 * captcha_provider 对应主题的 CAPTCHA_CONFIG.captchaType ('google' | 'cloudflare')
 */
export function normalizeXboardGuestConfig(data) {
  if (!data || typeof data !== 'object') return data;

  const enabled = Number(data.is_captcha ?? data.is_recaptcha) === 1;
  const type = data.captcha_type || 'recaptcha';
  const normalized = { ...data };

  if (type === 'turnstile') {
    normalized.recaptcha_site_key = data.turnstile_site_key || '';
    normalized.captcha_provider = 'cloudflare';
  } else if (type === 'recaptcha-v3') {
    // v3 为无感验证，不渲染组件，由请求拦截器在提交时获取 token
    normalized.is_recaptcha = 0;
    normalized.captcha_provider = 'google';
  } else {
    normalized.captcha_provider = 'google';
  }

  captchaState = {
    enabled,
    type,
    siteKey: type === 'recaptcha-v3' ? (data.recaptcha_v3_site_key || '') : normalized.recaptcha_site_key
  };

  return normalized;
}

const loadRecaptchaV3 = (siteKey) => {
  if (window.grecaptcha && window.grecaptcha.execute) {
    return Promise.resolve(window.grecaptcha);
  }
  if (!recaptchaV3Loader) {
    recaptchaV3Loader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.onload = () => window.grecaptcha.ready(() => resolve(window.grecaptcha));
      script.onerror = () => {
        recaptchaV3Loader = null;
        reject(new Error('reCAPTCHA v3 加载失败'));
      };
      document.head.appendChild(script);
    });
  }
  return recaptchaV3Loader;
};

const isCaptchaRequest = (url = '') => CAPTCHA_PATHS.some(path => url.includes(path));

/**
 * 按 Xboard 当前的验证方式补齐请求参数
 * - turnstile: 页面仍以 recaptcha_data 提交，这里复制为 turnstile_token
 * - recaptcha-v3: 提交前执行 grecaptcha.execute 获取 recaptcha_v3_token
 */
export async function applyXboardCaptcha(config) {
  if (!captchaState.enabled || !isCaptchaRequest(config.url)) return config;

  const data = { ...(config.data || {}) };

  if (captchaState.type === 'turnstile' && data.recaptcha_data && !data.turnstile_token) {
    data.turnstile_token = data.recaptcha_data;
  }

  if (captchaState.type === 'recaptcha-v3' && captchaState.siteKey && !data.recaptcha_v3_token) {
    try {
      const grecaptcha = await loadRecaptchaV3(captchaState.siteKey);
      data.recaptcha_v3_token = await grecaptcha.execute(captchaState.siteKey, { action: 'submit' });
    } catch (error) {
      console.error('获取 reCAPTCHA v3 token 失败:', error);
    }
  }

  config.data = data;
  return config;
}
