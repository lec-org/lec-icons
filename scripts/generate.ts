/** 从本地 SVG 和来源清单生成 React 图标。日常使用无需运行生成器。 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { optimize, type XastChild, type XastElement, type XastRoot } from 'svgo';

interface IconSource {
  name: string;
  label: string;
  component: string;
  category: string;
  file: string;
  license: string;
  source: string;
}

const root = new URL('../', import.meta.url);
const sources: IconSource[] = JSON.parse(await readFile(new URL('icons.json', root), 'utf8'));
const categories: { id: string; folder: string; label: string; kind: string; description: string }[] =
  JSON.parse(await readFile(new URL('categories.json', root), 'utf8'));
const uiSources: { name: string; label: string; category: string }[] =
  JSON.parse(await readFile(new URL('ui-icons.json', root), 'utf8'));

function property(name: string) {
  if (name === 'class') return 'className';
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  return name.replace(/[-:]([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function visit(node: XastElement, work: (element: XastElement) => void) {
  work(node);
  for (const child of node.children) {
    if (child.type === 'element') visit(child, work);
  }
}

function renderSvg(svg: XastElement) {
  const ids = new Set<string>();
  visit(svg, (node) => {
    if (['script', 'foreignObject', 'style', 'image'].includes(node.name)) {
      throw new Error('SVG 包含不支持的元素：' + node.name);
    }
    if (node.attributes.id) ids.add(node.attributes.id);
    for (const [name, value] of Object.entries(node.attributes)) {
      if (/^on/i.test(name) || (/href$/.test(name) && !value.startsWith('#'))) {
        throw new Error('SVG 不允许事件处理器或外部引用。');
      }
    }
  });

  function attribute(name: string, value: string) {
    if (name === 'style') {
      const styles = Object.fromEntries(value.split(';').filter(Boolean).map((declaration) => {
        const separator = declaration.indexOf(':');
        if (separator < 1) throw new Error('无法解析 SVG 内联样式。');
        return [property(declaration.slice(0, separator).trim()), declaration.slice(separator + 1).trim()];
      }).filter(([name]) => {
        // 上游编辑器导出的 SVG 2 草案属性不参与现行浏览器渲染。
        return !['shapePadding', 'shapeMargin', 'solidColor', 'solidOpacity'].includes(name!);
      }));
      return 'style={' + JSON.stringify(styles) + '}';
    }
    if (name === 'id') return 'id={id + ' + JSON.stringify('-' + value) + '}';
    if (/href$/.test(name) && ids.has(value.slice(1))) {
      return property(name) + '={"#" + id + ' + JSON.stringify('-' + value.slice(1)) + '}';
    }
    const reference = /^url\(#(.+)\)$/.exec(value);
    if (reference) {
      if (!ids.has(reference[1]!)) throw new Error('SVG 引用了不存在的 ID。');
      return property(name) + '={"url(#" + id + ' + JSON.stringify('-' + reference[1] + ')') + '}';
    }
    return property(name) + '={' + JSON.stringify(value) + '}';
  }

  function render(node: XastChild, level: number): string {
    const indent = '  '.repeat(level);
    if (node.type === 'text') return indent + '{' + JSON.stringify(node.value) + '}';
    if (node.type !== 'element') return '';
    const attrs = Object.entries(node.attributes).map(([name, value]) => attribute(name, value));
    const opening = '<' + node.name + (attrs.length ? ' ' + attrs.join(' ') : '');
    if (!node.children.length) return indent + opening + ' />';
    const children = node.children.map((child) => render(child, level + 1)).filter(Boolean).join('\n');
    return indent + opening + '>\n' + children + '\n' + indent + '</' + node.name + '>';
  }

  const attributes = Object.entries(svg.attributes)
    .filter(([key]) => !['xmlns', 'xmlns:xlink', 'viewBox', 'width', 'height', 'id'].includes(key))
    .map(([name, value]) => attribute(name, value)).join(' ');
  const viewBox = svg.attributes.viewBox;
  if (!viewBox) throw new Error('SVG 缺少 viewBox。');
  return {
    useId: ids.size > 0,
    jsx: '    <IconBase' + (attributes ? ' ' + attributes : '') + ' viewBox=' + JSON.stringify(viewBox) + ' {...props}>\n'
      + svg.children.map((child) => render(child, 3)).filter(Boolean).join('\n')
      + '\n    </IconBase>',
  };
}

const exports: string[] = [];
for (const source of sources) {
  const asset = await readFile(new URL('assets/' + source.file, root));
  let useId = false;
  let jsx: string;
  if (source.file.endsWith('.svg')) {
    let tree: XastRoot | undefined;
    optimize(asset.toString('utf8'), {
      path: source.file,
      plugins: ['preset-default', 'convertStyleToAttrs', {
        name: 'capture-tree',
        fn: (node) => { tree = node; },
      }],
    });
    const svg = tree?.children.find((node): node is XastElement => node.type === 'element' && node.name === 'svg');
    if (!svg) throw new Error('无法读取 SVG：' + source.file);
    ({ useId, jsx } = renderSvg(svg));
  } else {
    // 位图素材内嵌原图，以保留配色、透明通道和原始格式。
    const href = 'data:image/png;base64,' + asset.toString('base64');
    jsx = '    <IconBase viewBox="0 0 128 128" {...props}>\n'
      + '      <image href=' + JSON.stringify(href) + ' width="128" height="128" />\n'
      + '    </IconBase>';
  }
  const module = '/** 自动生成的 ' + source.label + ' 图标，来源与许可见 icons.json。 */\n'
    + (useId ? "import { useId } from 'react';\n" : '')
    + "import { IconBase, type IconProps } from '../../IconBase.js';\n\n"
    + 'export function ' + source.component + '(props: IconProps) {\n'
    + (useId ? '  const id = useId();\n' : '')
    + '  return (\n' + jsx + '\n  );\n}\n';
  const folder = categories.find((category) => category.id === source.category)?.folder;
  if (!folder) throw new Error('未定义的品牌分类：' + source.category);
  await mkdir(new URL('src/brand/' + folder + '/', root), { recursive: true });
  await writeFile(new URL('src/brand/' + folder + '/' + source.name + '.tsx', root), module);
  exports.push('export { ' + source.component + ' } from ' + JSON.stringify('./brand/' + folder + '/' + source.name + '.js') + ';');
}
await writeFile(new URL('src/index.ts', root), [
  '/** LEC 共享图标入口，品牌图标保留原色，界面图标使用 currentColor。 */',
  "export type { IconProps } from './IconBase.js';",
  "export { iconCatalog, iconCategories, type BrandIconName, type IconCategory } from './catalog.js';",
  "export * from './ui/index.js';",
  ...exports,
  '',
].join('\n'));
await writeFile(new URL('src/catalog.ts', root), [
  '/** 图标清单，可用于分类、搜索与展示来源。 */',
  'export const iconCatalog = ' + JSON.stringify(sources, null, 2) + ' as const;',
  'export const iconCategories = ' + JSON.stringify(categories, null, 2) + ' as const;',
  "export type BrandIconName = typeof iconCatalog[number]['name'];",
  "export type IconCategory = typeof iconCatalog[number]['category'];",
  '',
].join('\n'));
for (const category of categories) {
  const path = category.kind === 'brand' ? 'src/brand/' + category.folder : 'src/ui/' + category.folder;
  await mkdir(new URL(path + '/', root), { recursive: true });
  const content = category.kind === 'brand'
    ? sources.filter((source) => source.category === category.id)
      .map((source) => 'export { ' + source.component + ' } from "./' + source.name + '.js";').join('\n')
    : 'export {\n' + uiSources.filter((source) => source.category === category.id)
      .map((source) => '  ' + source.name + ',').join('\n') + '\n} from "lucide-react";';
  await writeFile(new URL(path + '/index.ts', root), '/** ' + category.label + '图标分类入口。 */\n' + content + '\n');
}
await writeFile(new URL('src/ui/catalog.ts', root), [
  '/** 界面图标的名称与分类清单。 */',
  'export const uiCatalog = ' + JSON.stringify(uiSources, null, 2) + ' as const;',
  "export type UiIconName = typeof uiCatalog[number]['name'];",
  "export const uiIconNames: readonly UiIconName[] = uiCatalog.map((icon) => icon.name);",
  '',
].join('\n'));
await writeFile(new URL('src/ui/index.ts', root), [
  '/** Lucide 界面图标统一入口。 */',
  ...categories.filter((category) => category.kind === 'ui')
    .map((category) => 'export * from "./' + category.folder + '/index.js";'),
  'export { uiCatalog, uiIconNames, type UiIconName } from "./catalog.js";',
  'export type { LucideIcon, LucideProps } from "lucide-react";',
  '',
].join('\n'));

// 分类路径供新代码使用，旧单图标和素材路径继续由导出映射解析。
const manifestPath = new URL('package.json', root);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.exports = {
  '.': './src/index.ts',
  './catalog': './src/catalog.ts',
  './ui': './src/ui/index.ts',
  './ui/*': './src/ui/*/index.ts',
  './assets/*': './assets/*',
};
for (const category of categories.filter((category) => category.kind === 'brand')) {
  manifest.exports['./' + category.folder] = './src/brand/' + category.folder + '/index.ts';
}
for (const source of sources) {
  const folder = categories.find((category) => category.id === source.category)!.folder;
  manifest.exports['./icons/' + source.name] = './src/brand/' + folder + '/' + source.name + '.tsx';
  manifest.exports['./assets/' + source.file.split('/').at(-1)] = './assets/' + source.file;
}
// workspace 使用源码；发布包只导出已编译的 JavaScript、类型声明与原始素材。
manifest.publishConfig.exports = Object.fromEntries(
  Object.entries(manifest.exports as Record<string, string>).map(([path, source]) => {
    if (source.startsWith('./assets/')) return [path, source];
    const target = source.replace('./src/', './dist/').replace(/\.tsx?$/, '.js');
    return [path, { types: target.replace(/\.js$/, '.d.ts'), import: target, default: target }];
  }),
);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('已生成 ' + sources.length + ' 个图标，目录 ' + fileURLToPath(new URL('src/brand/', root)));
