# @lec-org/icons

本仓库维护 LEC 共用的品牌与界面图标、原始素材及 VitePress 文档站。源码通过 Lec Platform 的 `packages/icons` 子模块固定版本。

开发依赖与文档站纳入 Lec Platform 根 workspace，由平台根目录的 pnpm 锁文件统一安装。包名和公开导出保持稳定，业务 API 与 OJ 协议由应用仓库维护。

变更先在本仓提交并推送，再更新 Lec Platform 的子模块引用。安装、构建与测试应使用平台记录的一组子模块版本。
