import { expect, test } from '@playwright/test';

test('分类数量、图片加载、搜索与代码引入示例', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.locator('.icon-card')).toHaveCount(111);
  const broken = await page.locator('.icon-card img').evaluateAll(async (images) => {
    await Promise.all(images.map(async (image) => {
      const img = image as HTMLImageElement;
      img.loading = 'eager';
      await img.decode().catch(() => undefined);
    }));
    return images.filter((image) => !(image as HTMLImageElement).naturalWidth).length;
  });
  expect(broken).toBe(0);
  await page.getByRole('button', { name: '数据库 5', exact: true }).click();
  await expect(page.locator('.icon-card')).toHaveCount(5);
  await page.getByRole('button', { name: '全部 111', exact: true }).click();
  await page.getByRole('searchbox', { name: '搜索图标' }).fill('PythonIcon');
  await expect(page.locator('.icon-card')).toHaveCount(1);
  await page.getByRole('button', { name: '查看 Python 图标' }).click();
  const details = page.getByRole('dialog');
  await expect(details).toBeVisible();
  await expect(details.locator('pre')).toContainText("from '@lec-space/icons'");
  await details.getByRole('combobox').selectOption('category');
  await expect(details.locator('pre')).toContainText("from '@lec-space/icons/languages'");
  await details.getByRole('combobox').selectOption('asset');
  await expect(details.locator('pre')).toContainText('assets/languages/python.svg');
  await details.getByRole('button', { name: '复制代码' }).click();
  await expect(details.getByRole('button', { name: '已复制' })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('assets/languages/python.svg');
  await page.keyboard.press('Escape');
  await expect(details).not.toBeVisible();
  await expect(page.getByRole('button', { name: '查看 Python 图标' })).toBeFocused();
  await page.getByRole('searchbox', { name: '搜索图标' }).fill('没有这个图标');
  await expect(page.getByRole('heading', { name: '没有找到匹配的图标' })).toBeVisible();
  await page.getByRole('button', { name: '清除筛选' }).click();
  await expect(page.locator('.icon-card')).toHaveCount(111);
  expect(errors).toEqual([]);
});

test('手机与暗色布局、界面图标分类导入、指南链接', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('searchbox', { name: '搜索图标' }).fill('Search');
  await page.getByRole('button', { name: '查看 搜索 图标' }).click();
  const details = page.getByRole('dialog');
  await details.getByRole('combobox').selectOption('category');
  await expect(details.locator('pre')).toContainText('@lec-space/icons/ui/actions');
  const bounds = await details.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await details.getByRole('button', { name: '关闭详情' }).click();
  await page.getByRole('link', { name: '查看使用指南' }).click();
  await expect(page.getByRole('heading', { name: /^快速开始/, level: 1 })).toBeVisible();
});
