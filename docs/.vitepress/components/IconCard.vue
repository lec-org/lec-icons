<script setup lang="ts">
import type { GalleryIcon } from '../catalog-types';

interface Props {
  icon: GalleryIcon;
}

defineProps<Props>();
defineEmits<{ select: [icon: GalleryIcon] }>();
</script>

<template>
  <button
    class="icon-card"
    type="button"
    :data-icon-name="icon.name"
    :aria-label="'查看 ' + icon.label + ' 图标'"
    @click="$emit('select', icon)"
  >
    <span class="icon-card__preview" :class="{ 'icon-card__preview--brand': icon.kind === 'brand' }">
      <img v-if="icon.kind === 'brand'" :src="icon.preview" alt="" width="30" height="30" loading="lazy" />
      <span v-else class="icon-card__svg" v-html="icon.preview"></span>
    </span>
    <span class="icon-card__label">{{ icon.label }}</span>
    <span class="icon-card__name">{{ icon.component }}</span>
  </button>
</template>

<style scoped>
.icon-card {
  display: flex; flex-direction: column; align-items: flex-start;
  min-width: 0; min-height: 150px; padding: 18px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 12px;
  text-align: left; cursor: pointer; transition: border-color .15s, background .15s;
}
.icon-card:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.icon-card__preview {
  display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 16px;
  border: 1px solid var(--vp-c-divider); border-radius: 10px; color: var(--vp-c-text-1);
}
.icon-card__preview--brand { background: #fff; }
.icon-card__preview img { display: block; object-fit: contain; }
.icon-card__svg { display: grid; place-items: center; }
.icon-card__label { font-size: 14px; font-weight: 600; line-height: 22px; }
.icon-card__name {
  width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: var(--vp-font-family-mono); font-size: 11px; line-height: 21px; color: var(--vp-c-text-2);
}
</style>
