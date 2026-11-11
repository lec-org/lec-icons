<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

interface Props {
  code: string;
}

const props = defineProps<Props>();
const copied = ref(false);
const error = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    error.value = '';
    clearTimeout(timer);
    timer = setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    error.value = '复制失败，可选择下方代码手动复制。';
  }
}
watch(() => props.code, () => { copied.value = false; error.value = ''; });
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="copy-code">
    <div class="copy-code__toolbar">
      <span>引入示例</span>
      <button type="button" @click="copy">{{ copied ? '已复制' : '复制代码' }}</button>
    </div>
    <pre tabindex="0"><code>{{ code }}</code></pre>
    <p v-if="error" role="status">{{ error }}</p>
  </div>
</template>

<style scoped>
.copy-code { overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-alt); }
.copy-code__toolbar { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px 6px 16px; font-size: 12px; color: var(--vp-c-text-2); border-bottom: 1px solid var(--vp-c-divider); }
.copy-code button { min-height: 36px; padding: 0 12px; border-radius: 6px; color: var(--vp-c-brand-1); font-weight: 600; cursor: pointer; }
.copy-code button:hover { background: var(--vp-c-brand-soft); }
.copy-code pre { margin: 0; padding: 18px; overflow: auto; line-height: 1.8; font-size: 12px; }
.copy-code code { font-family: var(--vp-font-family-mono); }
.copy-code p { margin: 0; padding: 0 16px 16px; font-size: 12px; color: var(--vp-c-danger-1); }
</style>
