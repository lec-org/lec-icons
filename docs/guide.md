# 快速开始

## 从 npm 安装

```sh
npm install @lec-space/icons@1.0.0
```

npm 发布包提供编译后的 ESM、类型声明、原始素材与许可证；消费项目无需编译本库的 TSX 源码。

`@lec-space/icons` 是 LEC 的私有 workspace 包。React 项目可以使用组件，Vue 或纯图片场景可以引入品牌原始素材。

## 在 workspace 中接入

在应用的 `package.json` 中添加依赖，然后在 Lec Platform 根目录运行 `pnpm install`。

```json
{
  "dependencies": {
    "@lec-space/icons": "workspace:*"
  }
}
```

## 从统一入口引入

```tsx
import { PythonIcon, ReactIcon, Search, Settings } from '@lec-space/icons';

export function Toolbar() {
  return (
    <div>
      <PythonIcon size={20} />
      <span>Python</span>
      <ReactIcon size={24} title="React" />
      <button aria-label="搜索"><Search size={18} /></button>
      <button aria-label="设置"><Settings size={18} /></button>
    </div>
  );
}
```

品牌组件以 `Icon` 结尾，界面组件沿用 Lucide 名称。点击图标库里的任意图标，可以查看准确的导出名。

## 从分类入口引入

原始素材和 React 组件使用相同的分类目录。

```tsx
import { PythonIcon, CppIcon } from '@lec-space/icons/languages';
import { ReactIcon, NestJsIcon } from '@lec-space/icons/frameworks';
import { PostgreSqlIcon } from '@lec-space/icons/databases';
import { GitHubIcon, DockerIcon } from '@lec-space/icons/tools';

import { Search, Copy } from '@lec-space/icons/ui/actions';
import { ArrowLeft, House } from '@lec-space/icons/ui/navigation';
import { CircleCheck } from '@lec-space/icons/ui/status';
```

也可以直接引入单个品牌组件。统一入口和单图标入口均支持构建工具按需裁剪。

```tsx
import { PythonIcon } from '@lec-space/icons/icons/python';
```

## 使用原始 SVG 或 PNG

在 Vite 项目中，可以直接把品牌素材作为图片 URL 引入。

```tsx
import pythonUrl from '@lec-space/icons/assets/languages/python.svg';
import cangjieUrl from '@lec-space/icons/assets/languages/cangjie.png';

<img src={pythonUrl} width={24} height={24} alt="Python" />
<img src={cangjieUrl} width={24} height={24} alt="仓颉" />
```

在 Vue 中使用同一份素材。

```vue
<script setup lang="ts">
import pythonUrl from '@lec-space/icons/assets/languages/python.svg';
</script>

<template>
  <img :src="pythonUrl" alt="Python" width="24" height="24" />
</template>
```

仓颉来源提供的是 PNG，包内保留原始格式。已有的 `@lec-space/icons/assets/python.svg` 等短路径也继续可用。

## 尺寸、颜色与名称

| 属性或场景 | 用法 |
| --- | --- |
| 品牌图标大小 | `size={20}`，也接受 `"1.5em"`，默认 20px |
| 单独指定宽高 | `width={32} height={24}` |
| 品牌图标颜色 | 保留原始品牌配色 |
| 界面图标颜色 | 用 CSS `color` 或 Lucide 的 `color` 属性 |
| 旁边已有文字 | 品牌图标默认作为装饰隐藏 |
| 独立品牌图标 | 设置 `title="Python"` 或 `aria-label="Python"` |
| 图标按钮 | 把操作名称放在按钮的 `aria-label` 上 |

```tsx
import { PythonIcon, Search } from '@lec-space/icons';

<PythonIcon size={24} title="Python" />
<Search size={20} color="currentColor" strokeWidth={1.75} />
```

图标库支持明暗主题。品牌预览使用浅色底板，让带黑色细节的原色标识仍然清晰。应用可以根据自己的背景选择图标的展示底色。

## 查看清单

数量、名称和分类都来自包内清单。

```ts
import { iconCatalog, iconCategories } from '@lec-space/icons/catalog';
import { uiCatalog, uiIconNames } from '@lec-space/icons/ui';

const databases = iconCatalog.filter((icon) => icon.category === 'database');
const actions = uiCatalog.filter((icon) => icon.category === 'actions');
```
