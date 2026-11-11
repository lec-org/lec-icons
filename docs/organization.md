# 分类与维护

品牌图标按照技术用途分类，界面图标按照交互用途分类。原始素材与组件目录使用相同的品牌分类名。

## 文件夹结构

```text
packages/icons/
├── assets/
│   ├── languages/        # 语言、HTML 与 CSS
│   ├── frameworks/       # 框架、运行时与构建工具
│   ├── databases/        # 数据库与缓存
│   └── tools/            # 开发、版本管理与部署
├── src/
│   ├── brand/
│   │   ├── languages/
│   │   ├── frameworks/
│   │   ├── databases/
│   │   └── tools/
│   ├── ui/
│   │   ├── navigation/
│   │   ├── actions/
│   │   ├── status/
│   │   ├── files/
│   │   ├── communication/
│   │   └── system/
│   ├── IconBase.tsx
│   ├── catalog.ts
│   └── index.ts
├── categories.json
├── icons.json
├── ui-icons.json
├── licenses/
└── docs/                 # 当前 VitePress 站点
```

| 分类目录 | 收录范围 |
| --- | --- |
| languages | C、C++、Python、Java、Zig、仓颉等语言与网页基础标识 |
| frameworks | React、Vue、NestJS、Bun、Vite 等框架与运行时 |
| databases | PostgreSQL、MySQL、MongoDB、Redis、SQLite |
| tools | Git、GitHub、Docker、Kubernetes、VS Code 等工具 |
| ui/navigation | 方向、页面入口与跳转 |
| ui/actions | 搜索、编辑、复制、上传、下载与执行 |
| ui/status | 成功、警告、等待与状态提示 |
| ui/files | 文件、代码、题目与列表 |
| ui/communication | 通知、邮件与成员 |
| ui/system | 时间、硬件、配色与终端 |

## 新增品牌图标

1. 把原始素材放入相应的 `assets/<分类>/` 文件夹。
2. 在 `icons.json` 添加名称、组件名、分类、文件路径、来源和许可。
3. 运行生成命令，更新 React 组件、分类入口和导出映射。
4. 检查图标预览，再运行类型检查与测试。

```sh
pnpm --filter @lec-org/icons generate
pnpm --filter @lec-org/icons typecheck
pnpm --filter @lec-org/icons test
pnpm icons:build
```

生成器为渐变、遮罩和裁剪引用分配实例级 ID，确保多个相同图标同时出现时正确显示。应用运行时使用仓库里的本地素材。

## 新增界面图标

在 `ui-icons.json` 中填写 Lucide 的导出名、中文名称和界面分类，再运行 `generate`。生成器会更新对应的 `src/ui/<分类>/index.ts`、清单和统一入口。

## 新增分类

分类定义放在 `categories.json`，其中 `id` 用于清单筛选，`folder` 用于目录和分类导入路径。更改现有分类时保持 `id` 稳定，可以让已有筛选代码继续使用。

## 文档站

以下命令在 Lec Platform 根目录执行。

```sh
pnpm icons:dev       # http://127.0.0.1:5175
pnpm icons:build     # 生成静态站点
pnpm icons:preview   # 预览构建结果
```

站点产物位于 `packages/icons/docs/.vitepress/dist/`。图标预览、数量和分类在构建时读取包内清单，不需要 API 服务。部署到子目录时，需要在 `.vitepress/config.ts` 配置 VitePress 的 `base`。

## 来源与许可

Devicon 品牌 SVG 的来源保存在 `icons.json`。界面图标由 Lucide 提供。仓颉素材来自官方编辑器扩展，保留原始 PNG 和许可说明。

具体许可文本随包放在 `licenses/`。页面中的图标详情也提供来源链接和许可名称。第三方品牌标识的使用仍应遵守其品牌规范。
