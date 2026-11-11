import { readFileSync } from 'node:fs';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as uiIcons from 'lucide-react';
import type { GalleryCategory, GalleryData, GalleryIcon } from './.vitepress/catalog-types';

const packageRoot = new URL('../', import.meta.url);

export default {
  watch: ['../icons.json', '../ui-icons.json', '../categories.json', '../assets/**/*', '../src/ui/**/*.ts'],
  load(): GalleryData {
    const iconCatalog: (Omit<GalleryIcon, 'id' | 'kind' | 'folder' | 'preview'> & { file: string })[] =
      JSON.parse(readFileSync(new URL('icons.json', packageRoot), 'utf8'));
    const iconCategories: GalleryCategory[] =
      JSON.parse(readFileSync(new URL('categories.json', packageRoot), 'utf8'));
    const uiCatalog: Pick<GalleryIcon, 'name' | 'label' | 'category'>[] =
      JSON.parse(readFileSync(new URL('ui-icons.json', packageRoot), 'utf8'));
    const brands: GalleryIcon[] = iconCatalog.map((icon) => {
      const asset = readFileSync(new URL('assets/' + icon.file, packageRoot));
      const mime = icon.file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
      const category = iconCategories.find((category) => category.id === icon.category)!;
      return {
        ...icon,
        id: 'brand:' + icon.name,
        kind: 'brand',
        folder: category.folder,
        preview: 'data:' + mime + ';base64,' + asset.toString('base64'),
      };
    });
    const ui: GalleryIcon[] = uiCatalog.map((icon) => {
      const Component = uiIcons[icon.name as keyof typeof uiIcons] as ComponentType<{ size: number; 'aria-hidden': boolean }>;
      if (!Component) throw new Error('无法读取 Lucide 图标：' + icon.name);
      const slug = icon.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      return {
        ...icon,
        id: 'ui:' + icon.name,
        component: icon.name,
        kind: 'ui',
        folder: icon.category,
        preview: renderToStaticMarkup(createElement(Component, { size: 28, 'aria-hidden': true })),
        source: 'https://lucide.dev/icons/' + slug,
        license: 'ISC / Feather MIT',
      };
    });
    return { icons: [...brands, ...ui], categories: [...iconCategories] };
  },
};

export declare const data: GalleryData;
