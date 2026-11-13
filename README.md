# @lec-space/icons

## npm 安装

```sh
npm install @lec-space/icons@1.0.0
```

文档站：[https://lec-org.github.io/lec-icons/](https://lec-org.github.io/lec-icons/)。

本仓库作为 `lec-platform/packages/icons` 子模块维护。开发时从 [Lec Platform](https://github.com/lec-org/lec-platform) 递归检出源码，并在平台根目录执行 `pnpm install --frozen-lockfile`。下文的 workspace 命令均从平台根目录运行。

LEC 项目共用的 workspace 图标包，提供带原始配色的品牌图标、Lucide 界面图标和原始素材。

当前包含 55 个品牌图标（53 个 SVG、仓颉与 line 原始 PNG）与 57 个界面图标。完整清单、来源及许可证记录在 [icons.json](icons.json) 和 [ui-icons.json](ui-icons.json)。

## React 用法

在应用的 dependencies 中添加 `"@lec-space/icons": "workspace:*"`。

```tsx
import { PythonIcon, ReactIcon, GitHubIcon, Search, Settings } from '@lec-space/icons';

<PythonIcon size={20} />
<ReactIcon size={24} title="React" />
<GitHubIcon size="1.5em" aria-label="GitHub" />
<Search size={18} aria-hidden="true" />
<Settings size={18} aria-label="设置" />
```

品牌图标支持标准 SVG 属性、`size` 和 `title`。默认大小为 20px，`width`、`height` 可以单独覆盖。有相邻文字时默认作为装饰隐藏，独立表达含义时设置 `title`、`aria-label` 或 `aria-labelledby`。品牌图标保留原色，界面图标使用 `currentColor`，通过 CSS 的 `color` 继承颜色。

每个图标独立导出，入口声明 `sideEffects: false`，供构建工具按需裁剪。也可以直接导入单个品牌图标或界面图标入口。

```tsx
import { PythonIcon } from '@lec-space/icons/icons/python';
import { Search } from '@lec-space/icons/ui';
import pythonUrl from '@lec-space/icons/assets/languages/python.svg';

<img src={pythonUrl} alt="Python" />
```

## 分类与查找

| 分类 | 图标 |
| --- | --- |
| 语言与网页基础 | C、C++、C#、Python、Java、JavaScript、TypeScript、Go、Rust、Zig、仓颉、Kotlin、Swift、Ruby、PHP、Dart、Scala、Elixir、Erlang、Racket、Lua、Bash、HTML5、CSS3 |
| 框架与运行时 | React、Vue、Angular、Svelte、Next.js、NestJS、Node.js、Bun、Vite、Tailwind CSS、GraphQL |
| 数据库 | PostgreSQL、MySQL、MongoDB、Redis、SQLite |
| 开发与部署工具 | Docker、Kubernetes、Git、GitHub、GitLab、Linux、Ubuntu、Nginx、Jenkins、pnpm、npm、VS Code、Figma、Markdown |
| 界面操作 | 已有的导航、状态、日历、评测、上传图标，以及复制、下载、用户、设置、通知、明暗模式等 |

`iconCatalog` 只包含品牌清单，可用于搜索和分类。`uiIconNames` 提供界面图标的导出名。

```ts
import { iconCatalog, type BrandIconName } from '@lec-space/icons/catalog';
import { uiIconNames } from '@lec-space/icons/ui';

const databases = iconCatalog.filter((icon) => icon.category === 'database');
// name、label、component、category、file、license、source
```

LecOJ 的语言菜单和现有界面图标已改用此包。语言绑定放在应用侧，不影响包在 SSO、文档等其他项目中使用。

## 浏览图标

文档站使用 VitePress，提供数量统计、分类筛选、中文或组件名搜索，以及可复制的组件与原始素材引入示例。

```sh
pnpm icons:dev       # http://127.0.0.1:5175
pnpm icons:build
pnpm icons:preview
PLAYWRIGHT_CHANNEL=chrome pnpm icons:test
```

站点输出在 `docs/.vitepress/dist/`，统计与预览自动读取清单。分类入口支持 `@lec-space/icons/languages`、`@lec-space/icons/frameworks`、`@lec-space/icons/databases`、`@lec-space/icons/tools` 及 `@lec-space/icons/ui/<分类>`。

## 维护

原始素材按 `assets/languages`、`frameworks`、`databases`、`tools` 分类，React 组件对应放在 `src/brand/` 的同名目录。界面图标按导航、操作、状态、文件、成员消息、系统外观分组在 `src/ui/`。品牌 SVG 由清单生成，修改时先更新原图与 `icons.json`，然后运行以下命令。

```sh
pnpm --filter @lec-space/icons generate
pnpm --filter @lec-space/icons typecheck
pnpm --filter @lec-space/icons test
pnpm --filter @lec-space/icons build
```

生成过程使用 SVGO 清理 SVG，并为每个带渐变、遮罩或裁剪的实例生成独立 ID。源码和原始素材都保存在仓库，应用运行无需联网。

## 来源与许可

- 包内代码使用 MIT 许可，见 [LICENSE](LICENSE)。
- 品牌 SVG 来自 Devicon，新增素材固定到清单中记录的上游提交，MIT 许可见 [licenses/devicon-MIT.txt](licenses/devicon-MIT.txt)。
- 仓颉图标从现有工作台迁入，来源为仓颉官方 VS Code 扩展，保留 PNG 和 [原始许可](licenses/cangjie-Apache-2.0.txt)。
- line 品牌图标由用户提供，保留原始透明 PNG；来源项目和许可状态见 `icons.json`。
- 界面图标由依赖的 `lucide-react` 提供，ISC 许可及部分图标的 Feather MIT 许可见 [licenses/lucide-ISC-MIT.txt](licenses/lucide-ISC-MIT.txt)。

第三方标识的使用需遵守其品牌规范。

## 独立开发与文档发布

本仓可以独立检出，根目录执行 `pnpm install --frozen-lockfile` 后，运行 `pnpm --filter @lec-space/icons-docs dev`。平台集成开发仍在平台根目录安装依赖；各自的锁文件只约束对应工作区。

推送 main 会通过 `.github/workflows/pages.yml` 构建并发布 GitHub Pages。工作流只检出本仓，不需要平台私有仓库的访问令牌。`DOCS_BASE_PATH` 指定项目站路径，本地开发默认为 `/`。

发布前先构建与测试，再使用 `pnpm pack` 生成 tarball，核对其中的版本、入口、类型与许可证，最后执行 `npm publish <tarball> --access public --registry=https://registry.npmjs.org`。请发布 tarball，保证 npm 消费的是 `publishConfig.exports` 指向的编译产物。不要将 npm token 写入仓库。
