/**
 * 将 dist 打包为可在 Xboard 后台上传的主题
 * 用法：npm run build:xboard
 * 输出：dist-xboard/EZTheme.zip（后台 → 主题配置 → 上传主题）
 */
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const templateDir = path.join(root, 'xboard-theme');
const outRoot = path.join(root, 'dist-xboard');

const config = JSON.parse(fs.readFileSync(path.join(templateDir, 'config.json'), 'utf-8'));
const themeName = config.name;
const themeDir = path.join(outRoot, themeName);
const assetsBase = `/theme/${themeName}/`;

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('未找到 dist/index.html，请先执行 vue-cli-service build');
  process.exit(1);
}

// 版本号需递增，Xboard 才允许覆盖上传同名主题，因此附加构建时间
const pkg = require(path.join(root, 'package.json'));
const buildStamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
config.version = `${String(pkg.version || config.version).replace(/^v/i, '')}.${buildStamp}`;

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// 标题由 Xboard 后台「站点名称」提供
html = html.replace(/<title>[\s\S]*?<\/title>/i, '');

// 静态资源改为主题目录下的绝对路径
html = html.replace(/(src|href)="(?:\.\/)?(static|images)\//g, `$1="${assetsBase}$2/`);

// 其余内容原样输出，避免被 Blade 解析
const verbatim = (content) => `@verbatim\n${content}\n@endverbatim\n`;

const headInject = `<title>{{ $title }}</title>
<script>
  window.EZ_THEME = {
    title: @json($title),
    description: @json($description),
    logo: @json($logo),
    version: @json($version),
    assetsPath: @json('/theme/' . $theme),
    config: @json($theme_config ?? [])
  };
</script>
`;
const bodyInject = `{!! $theme_config['custom_html'] ?? '' !!}\n`;

const headIndex = html.search(/<head[^>]*>/i);
const headEnd = headIndex + html.slice(headIndex).match(/<head[^>]*>/i)[0].length;
const bodyClose = html.lastIndexOf('</body>');
if (headIndex < 0 || bodyClose < 0) {
  console.error('dist/index.html 结构异常，缺少 <head> 或 </body>');
  process.exit(1);
}

const blade =
  verbatim(html.slice(0, headEnd)) +
  headInject +
  verbatim(html.slice(headEnd, bodyClose)) +
  bodyInject +
  verbatim(html.slice(bodyClose));

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(themeDir, { recursive: true });
fs.cpSync(distDir, themeDir, {
  recursive: true,
  filter: (src) => path.relative(distDir, src) !== 'index.html'
});
fs.writeFileSync(path.join(themeDir, 'dashboard.blade.php'), blade, 'utf-8');
fs.writeFileSync(path.join(themeDir, 'config.json'), JSON.stringify(config, null, 2), 'utf-8');

const zip = new AdmZip();
zip.addLocalFolder(themeDir, themeName);
const zipPath = path.join(outRoot, `${themeName}.zip`);
zip.writeZip(zipPath);

console.log(`Xboard 主题已生成：${path.relative(root, zipPath)}（版本 ${config.version}）`);
