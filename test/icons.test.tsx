import { expect, test } from 'bun:test';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from '../src/index.js';
import { PythonIcon, Search, iconCatalog, type IconProps } from '../src/index.js';

test('全部品牌图标可重复渲染，渐变和遮罩引用属于各自实例', () => {
  const nodes = iconCatalog.flatMap((entry) => {
    const Component = icons[entry.component] as ComponentType<IconProps>;
    return [0, 1].map((index) => createElement(Component, { key: entry.name + index, title: entry.label }));
  });
  const html = renderToStaticMarkup(createElement('div', null, nodes));
  expect(html.match(/<svg /g)?.length).toBe(iconCatalog.length * 2);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  expect(ids.length).toBeGreaterThan(0);
  expect(new Set(ids).size).toBe(ids.length);
  const references = [...html.matchAll(/url\(#([^)]+)\)|(?:xlink:href|href)="#([^"]+)"/g)];
  for (const reference of references) {
    expect(ids).toContain(reference[1] ?? reference[2]);
  }
  expect(references.length).toBeGreaterThan(0);
});

test('默认作为装饰图标，有名称时提供无障碍语义，允许覆盖尺寸', () => {
  const decorative = renderToStaticMarkup(<PythonIcon size={16} />);
  expect(decorative).toContain('aria-hidden="true"');
  expect(decorative).toContain('width="16"');
  const named = renderToStaticMarkup(<PythonIcon title="Python" size={24} width={32} className="language" />);
  expect(named).toContain('role="img"');
  expect(named).toContain('aria-label="Python"');
  expect(named).toContain('<title>Python</title>');
  expect(named).not.toContain('aria-hidden="true"');
  expect(named).toContain('width="32"');
  expect(named).toContain('height="24"');
  expect(named).toContain('class="language"');
});

test('通用界面图标沿用 currentColor，仓颉保留原始 PNG', () => {
  expect(renderToStaticMarkup(<Search size={18} />)).toContain('stroke="currentColor"');
  expect(renderToStaticMarkup(<icons.CangjieIcon />)).toContain('data:image/png;base64,');
  expect(iconCatalog.filter((icon) => icon.file.endsWith('.svg'))).toHaveLength(53);
});

test('分类、单图标和旧入口导出同一组件，旧素材别名仍可解析', async () => {
  const language = await import('@lec-org/icons/languages');
  const single = await import('@lec-org/icons/icons/python');
  const actions = await import('@lec-org/icons/ui/actions');
  expect(language.PythonIcon).toBe(PythonIcon);
  expect(single.PythonIcon).toBe(PythonIcon);
  expect(actions.Search).toBe(Search);
  const asset = import.meta.resolve('@lec-org/icons/assets/python.svg');
  expect(asset).toEndWith('/assets/languages/python.svg');
  expect(await Bun.file(new URL(asset)).exists()).toBe(true);
});
