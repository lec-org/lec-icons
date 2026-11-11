<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { data } from '../../catalog.data';
import type { GalleryIcon } from '../catalog-types';
import IconCard from './IconCard.vue';
import IconDetails from './IconDetails.vue';

const query = ref('');
const category = ref('all');
const selected = ref<GalleryIcon | null>(null);
const brandCount = data.icons.filter((icon) => icon.kind === 'brand').length;
const uiCount = data.icons.length - brandCount;
const statistics = [
  { label: '全部图标', value: data.icons.length },
  { label: '品牌图标', value: brandCount },
  { label: '界面图标', value: uiCount },
  { label: '分类', value: data.categories.length },
];
const filters = [
  { id: 'all', label: '全部', count: data.icons.length },
  ...data.categories.map((item) => ({
    ...item,
    count: data.icons.filter((icon) => icon.category === item.id).length,
  })),
];
const visibleIcons = computed(() => {
  const search = query.value.trim().toLowerCase();
  return data.icons.filter((icon) => {
    const matchesCategory = category.value === 'all' || icon.category === category.value;
    const text = [icon.name, icon.label, icon.component].join(' ').toLowerCase();
    return matchesCategory && text.includes(search);
  });
});
const groups = computed(() => data.categories.map((item) => ({
  ...item,
  icons: visibleIcons.value.filter((icon) => icon.category === item.id),
})).filter((item) => item.icons.length));
function reset() {
  query.value = '';
  category.value = 'all';
}
</script>

<template>
  <main class="gallery">
    <header class="gallery__hero">
      <div class="gallery__intro">
        <p class="gallery__package">@lec-org/icons</p>
        <h1>为项目选一枚图标。</h1>
        <p class="gallery__description">按语言、框架和使用场景查找，点击图标即可复制引入代码。</p>
        <a :href="withBase('/guide')">查看使用指南 <span aria-hidden="true">↗</span></a>
      </div>
      <dl class="gallery__stats">
        <div v-for="stat in statistics" :key="stat.label">
          <dt>{{ stat.label }}</dt>
          <dd>{{ stat.value }}</dd>
        </div>
      </dl>
    </header>

    <section class="gallery__browser" aria-label="浏览图标">
      <div class="gallery__search-row">
        <label class="gallery__search">
          <span class="gallery__search-symbol" aria-hidden="true">⌕</span>
          <input v-model="query" aria-label="搜索图标" placeholder="搜索名称、组件名，例如 Python、搜索…" type="search" />
        </label>
        <span class="gallery__results" role="status">显示 {{ visibleIcons.length }} 个</span>
      </div>
      <nav class="gallery__filters" aria-label="图标分类">
        <button v-for="filter in filters" :key="filter.id" type="button" :aria-pressed="category === filter.id" @click="category = filter.id">
          {{ filter.label }} <span>{{ filter.count }}</span>
        </button>
      </nav>
    </section>

    <section v-for="group in groups" :key="group.id" class="gallery__group" :aria-labelledby="'group-' + group.id">
      <header class="gallery__group-heading">
        <h2 :id="'group-' + group.id">{{ group.label }} <span>{{ group.icons.length }}</span></h2>
        <p>{{ group.description }}</p>
      </header>
      <div class="gallery__grid">
        <IconCard v-for="icon in group.icons" :key="icon.id" :icon="icon" @select="selected = $event" />
      </div>
    </section>

    <div v-if="!visibleIcons.length" class="gallery__empty" role="status">
      <h2>没有找到匹配的图标</h2>
      <p>可以试试中文名称或组件名，也可以切换分类。</p>
      <button type="button" @click="reset">清除筛选</button>
    </div>
    <footer class="gallery__footer">数量与预览来自包内图标清单，素材及许可随包分发。</footer>
    <IconDetails :icon="selected" @close="selected = null" />
  </main>
</template>

<style scoped>
.gallery { max-width: 1280px; margin: 0 auto; padding: 56px 32px 36px; }
.gallery__hero { display: flex; align-items: center; justify-content: space-between; gap: 48px; margin-bottom: 44px; }
.gallery__package { margin: 0 0 14px; color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600; }
h1 { margin: 0; font-size: clamp(28px, 4vw, 40px); letter-spacing: -1.2px; font-weight: 700; line-height: 1.25; }
.gallery__description { max-width: 440px; margin: 16px 0 14px; color: var(--vp-c-text-2); font-size: 15px; line-height: 1.8; }
.gallery__intro a { color: var(--vp-c-brand-1); font-size: 13px; font-weight: 600; }
.gallery__stats { display: grid; grid-template-columns: repeat(2, 1fr); flex: none; width: 280px; gap: 22px 32px; padding-left: 32px; border-left: 1px solid var(--vp-c-divider); }
.gallery__stats div { display: flex; flex-direction: column-reverse; }
.gallery__stats dt { color: var(--vp-c-text-2); font-size: 12px; line-height: 22px; }
.gallery__stats dd { margin: 0; font-size: 30px; font-weight: 650; line-height: 1.3; font-variant-numeric: tabular-nums; }
.gallery__browser { margin-bottom: 32px; }
.gallery__search-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
.gallery__search { display: flex; align-items: center; flex: 1; max-width: 570px; min-height: 48px; gap: 12px; padding: 0 16px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-alt); }
.gallery__search:focus-within { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.gallery__search-symbol { font-size: 26px; color: var(--vp-c-text-2); }
.gallery__search input { width: 100%; height: 46px; min-width: 0; outline: none; font-size: 14px; background: transparent; }
.gallery__results { flex: none; font-size: 12px; color: var(--vp-c-text-2); font-variant-numeric: tabular-nums; }
.gallery__filters { display: flex; flex-wrap: wrap; gap: 8px; }
.gallery__filters button { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 36px; padding: 4px 12px; border: 1px solid transparent; border-radius: 7px; font-size: 12px; color: var(--vp-c-text-2); cursor: pointer; }
.gallery__filters button:hover { background: var(--vp-c-bg-soft); }
.gallery__filters button[aria-pressed="true"] { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-soft); font-weight: 600; }
.gallery__filters span { font-size: 10px; opacity: .8; }
.gallery__group { margin-bottom: 36px; }
.gallery__group-heading { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 14px; }
.gallery__group h2 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 16px; font-weight: 650; }
.gallery__group h2 span { color: var(--vp-c-text-3); font-size: 12px; font-weight: 400; }
.gallery__group-heading p { margin: 0; color: var(--vp-c-text-2); font-size: 12px; }
.gallery__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
.gallery__empty { padding: 64px 16px; text-align: center; }
.gallery__empty h2 { font-size: 18px; font-weight: 600; }
.gallery__empty p { margin: 12px 0; color: var(--vp-c-text-2); font-size: 14px; }
.gallery__empty button { min-height: 44px; padding: 0 16px; color: var(--vp-c-brand-1); cursor: pointer; }
.gallery__footer { padding-top: 12px; font-size: 12px; color: var(--vp-c-text-2); border-top: 1px solid var(--vp-c-divider); }
@media (max-width: 1000px) { .gallery__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 700px) {
  .gallery { padding: 32px 20px; }
  .gallery__hero { align-items: flex-start; gap: 24px; flex-direction: column; margin-bottom: 28px; }
  .gallery__stats { width: 100%; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 20px 0 0; margin: 0; border-left: none; border-top: 1px solid var(--vp-c-divider); }
  .gallery__stats dd { font-size: 25px; }
  .gallery__filters { flex-wrap: nowrap; overflow: auto; padding: 4px 2px 8px; }
  .gallery__filters button { flex: none; min-height: 40px; }
  .gallery__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .gallery__results { display: none; }
  .gallery__group-heading { display: block; }
  .gallery__group-heading p { margin-top: 5px; }
}
</style>
