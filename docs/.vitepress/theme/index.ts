import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import IconGallery from '../components/IconGallery.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('IconGallery', IconGallery);
  },
} satisfies Theme;
