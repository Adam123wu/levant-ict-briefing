
---

## 9. 内容列宽一致性强制规则

最终页面中，以下元素必须使用同一内容列宽，而不是各自独立宽度：

1. 国家标题卡片 `.country-hero`
2. 国家模块 `.module`
3. 新闻卡片 `.news-card`
4. 底部联系方式 `.contact-footer-note`
5. 底部口号 `.slogan-banner`

在当前设计中，底部区域不得全屏贴边；必须与国家内容区域对齐。  
模块头部必须使用固定布局：标题 / 条数 / 展开收起，条数和展开收起徽标必须固定宽高。

推荐规则：

```css
:root { --content-pad: 18px; }
.panel { padding: var(--content-pad); }
.country-hero,
details.module { width: 100%; }
.contact-footer-note,
.slogan-banner {
  margin-left: var(--content-pad);
  margin-right: var(--content-pad);
}
details.module > summary {
  display: grid;
  grid-template-columns: minmax(0,1fr) auto auto;
}
.module-count { min-width: 78px; height: 28px; }
details.module > summary span:last-child { min-width: 48px; height: 28px; }
```

若这类尺寸问题再次出现，自检必须判定失败。
