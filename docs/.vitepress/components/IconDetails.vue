<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { GalleryIcon } from '../catalog-types';
import CopyCode from './CopyCode.vue';

interface Props {
  icon: GalleryIcon | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
const mode = ref('root');
const snippet = computed(() => {
  const icon = props.icon;
  if (!icon) return '';
  if (mode.value === 'asset' && icon.file) {
    const variable = icon.name + 'Url';
    return "import " + variable + " from '@lec-space/icons/assets/" + icon.file + "';\n\n"
      + '<img src={' + variable + '} alt="' + icon.label + '" width={24} height={24} />';
  }
  const path = mode.value === 'category'
    ? '@lec-space/icons/' + (icon.kind === 'ui' ? 'ui/' : '') + icon.folder
    : '@lec-space/icons';
  const label = icon.kind === 'ui' ? 'aria-label' : 'title';
  return 'import { ' + icon.component + " } from '" + path + "';\n\n"
    + '<' + icon.component + ' size={24} ' + label + '="' + icon.label + '" />';
});

watch(() => props.icon, async (icon) => {
  mode.value = 'root';
  await nextTick();
  if (icon && !dialog.value?.open) dialog.value?.showModal();
  if (!icon) dialog.value?.close();
});

function closeBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) emit('close');
}
</script>

<template>
  <dialog ref="dialog" class="icon-details" aria-labelledby="icon-details-title" @cancel.prevent="emit('close')" @click="closeBackdrop">
    <div v-if="icon" class="icon-details__body">
      <header>
        <span class="icon-details__type">{{ icon.kind === 'brand' ? '品牌图标' : '界面图标' }}</span>
        <button class="icon-details__close" type="button" aria-label="关闭详情" @click="emit('close')">×</button>
      </header>
      <div class="icon-details__identity">
        <div class="icon-details__preview" :class="{ 'icon-details__preview--brand': icon.kind === 'brand' }">
          <img v-if="icon.kind === 'brand'" :src="icon.preview" alt="" width="48" height="48" />
          <span v-else v-html="icon.preview"></span>
        </div>
        <div>
          <h2 id="icon-details-title">{{ icon.label }}</h2>
          <code>{{ icon.component }}</code>
        </div>
      </div>
      <label class="icon-details__mode">
        引入方式
        <select v-model="mode">
          <option value="root">统一入口</option>
          <option value="category">分类入口</option>
          <option v-if="icon.file" value="asset">{{ icon.file.endsWith('.svg') ? '原始 SVG' : '原始 PNG' }}</option>
        </select>
      </label>
      <CopyCode :code="snippet" />
      <dl>
        <template v-if="icon.file">
          <dt>素材位置</dt>
          <dd><code>assets/{{ icon.file }}</code></dd>
        </template>
        <dt>许可</dt>
        <dd>{{ icon.license }}</dd>
        <dt>来源</dt>
        <dd><a :href="icon.source" target="_blank" rel="noreferrer">查看上游来源 ↗</a></dd>
      </dl>
    </div>
  </dialog>
</template>

<style scoped>
.icon-details { width: min(560px, calc(100vw - 32px)); max-height: calc(100dvh - 40px); margin: auto; padding: 0; overflow: auto; border: 1px solid var(--vp-c-divider); border-radius: 18px; background: var(--vp-c-bg); color: var(--vp-c-text-1); box-shadow: 0 24px 100px #0003; }
.icon-details::backdrop { background: #10182770; backdrop-filter: blur(4px); }
.icon-details__body { padding: 24px; }
header { display: flex; align-items: center; justify-content: space-between; }
.icon-details__type { font-size: 12px; color: var(--vp-c-text-2); }
.icon-details__close { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; font-size: 26px; cursor: pointer; }
.icon-details__close:hover { background: var(--vp-c-bg-soft); }
.icon-details__identity { display: flex; align-items: center; gap: 20px; margin: 12px 0 28px; }
.icon-details__preview { display: grid; place-items: center; width: 80px; height: 80px; flex: none; border: 1px solid var(--vp-c-divider); border-radius: 16px; }
.icon-details__preview--brand { background: #fff; }
.icon-details__identity h2 { margin: 0 0 4px; font-size: 26px; font-weight: 650; line-height: 1.4; }
.icon-details__identity code { color: var(--vp-c-text-2); font-size: 13px; overflow-wrap: anywhere; }
.icon-details__mode { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0 0 12px; font-size: 13px; }
select { min-height: 40px; padding: 0 32px 0 12px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg); color: var(--vp-c-text-1); appearance: auto; }
dl { display: grid; grid-template-columns: 72px 1fr; gap: 12px 8px; margin: 24px 0 4px; font-size: 12px; }
dt { color: var(--vp-c-text-2); }
dd { margin: 0; overflow-wrap: anywhere; }
dd a { color: var(--vp-c-brand-1); }
@media (max-width: 480px) { .icon-details__body { padding: 18px; } .icon-details__identity { gap: 14px; } }
</style>
