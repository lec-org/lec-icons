import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'LEC Icons',
  description: '浏览 LEC 图标库，按分类查找并复制 React 或 SVG 引入代码。',
  cleanUrls: true,
  themeConfig: {
    siteTitle: 'LEC Icons',
    nav: [
      { text: '图标库', link: '/' },
      { text: '快速开始', link: '/guide' },
      { text: '分类与维护', link: '/organization' },
    ],
    sidebar: {
      '/guide': [{ text: '使用图标', items: [
        { text: '快速开始', link: '/guide' },
        { text: '分类与维护', link: '/organization' },
      ] }],
      '/organization': [{ text: '使用图标', items: [
        { text: '快速开始', link: '/guide' },
        { text: '分类与维护', link: '/organization' },
      ] }],
    },
    search: { provider: 'local' },
    outline: { label: '本页内容' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    socialLinks: [{ icon: 'github', link: 'https://github.com/lec-org/lec-icons' }],
  },
});
