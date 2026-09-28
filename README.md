# 🚀 V2Board / Xboard 用户前端项目

一个美观、现代的 **V2Board / Xboard 用户前端项目**，基于 **Vue 3** 开发。

---

## ✨ 特性

- 🎨 美观的 UI 设计，简约高端  
- 🌓 支持亮色/暗色主题切换  
- 🌍 内置国际化支持（中文/英文）  
- 📱 响应式设计，完美适配各种设备  
- 🔒 完善的登录认证系统  
- 🚀 模块化代码结构，易于维护与扩展  

---

## 🧩 技术栈

| 技术           | 说明                     |
|----------------|--------------------------|
| **Vue 3**      | 渐进式 JavaScript 框架   |
| **Vue Router** | 官方路由管理器           |
| **Vuex**       | 状态管理模式             |
| **Axios**      | 基于 Promise 的 HTTP 客户端 |
| **Sass**       | CSS 预处理器             |
| **Vue I18n**   | 国际化解决方案           |

---

## 📂 项目结构

```
src/
├── api/                # API 接口
├── assets/             # 静态资源
│   └── styles/         # 样式文件
│       ├── base/       # 基础样式
│       ├── components/ # 组件样式
│       └── layouts/    # 布局样式
├── components/         # 公共组件
├── composables/        # 组合式 API
├── i18n/               # 国际化
│   └── locales/        # 语言包
├── router/             # 路由配置
├── store/              # Vuex 存储
├── utils/              # 工具函数
└── views/              # 页面视图
```

---
## ⚙️ 自定义配置

可在 `src/config/index.js` 文件中修改主题颜色、API 基础 URL 及其他配置。

### Xboard 配置

使用 Xboard 时，请将面板类型设为 `Xboard`，并确保 API 地址以 `/api/v1` 结尾：

```js
PANEL_TYPE: 'Xboard',
API_CONFIG: {
  urlMode: 'auto',
  autoConfig: {
    useSameProtocol: true,
    appendApiPath: true,
    apiPath: '/api/v1'
  }
}
```

新版 Xboard 支持礼品卡兑换。如需显示入口，可同时设置
`PROFILE_CONFIG.showGiftCardRedeem` 为 `true`。

Xboard 模式下，人机验证方式会自动跟随后端设置（reCAPTCHA v2 / Cloudflare Turnstile / reCAPTCHA v3），
无需再手动修改 `CAPTCHA_CONFIG.captchaType`。

### 作为 Xboard 主题部署（推荐）

```bash
npm run build:xboard
```

生成 `dist-xboard/EZTheme.zip`，在 Xboard 后台「主题配置」上传并启用即可。主题模式下：

- 自动使用同域名的 `/api/v1`，站点名称、描述、Logo 沿用后台「站点设置」
- 在后台「主题配置 → EZTheme」中可随时修改，无需重新打包：
  - **各平台客户端**：每行一个 `名称|说明|下载链接`，第一行为推荐客户端（仪表盘下载按钮也使用它），留空则引导页不显示该平台
  - **客服系统代码**：粘贴 Crisp 等嵌入代码，留空则关闭客服
  - **自定义 HTML**：统计代码、第三方脚本等，原样插入页面底部
- 每次打包的版本号会自动附加构建时间，可直接覆盖上传，已保存的主题配置会保留

---
## 🛠️ 开始使用

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 开发环境运行
```bash
npm run serve
```

### 3️⃣ 生产环境构建
```bash
npm run build
```

---



## 🌎 浏览器支持

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ 其他现代浏览器  

---

## 💖 支持项目开发

如果你喜欢这个项目，或者它对你有帮助，欢迎赞助支持我持续开发 🙏

| 网络                | 类型       | 地址                                         |
|--------------------|------------|----------------------------------------------|
| 🪙 **TRC20 (USDT)** | 捐赠地址   | `THaNoFeH2PnRJBWp13WKXG3i63PQ3nYcfX` |
| 🪙 **BEP20 (USDT)** | 捐赠地址   | `0xe19C23bf1C0Bd9a20434aA913EB94Fc0122CCF86` |

> ❤️ 你的支持是我继续改进和维护这个项目的最大动力！

---

## 🕊️ 开源万岁！

本项目遵循 **MIT License** 开源协议。  
欢迎提交 PR、Issue 或 Star ⭐ 支持本项目。

---

## 📢 社区与联系

👥 **公开群组**： [https://t.me/panghu_dev](https://t.me/panghu_dev)  
💬 **联系我**： [https://t.me/panghu_tg_room](https://t.me/panghu_tg_room)

---

_感谢所有支持开源的人，让世界更自由、更美好。_
