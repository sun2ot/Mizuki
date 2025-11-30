---
title: 破解网页的粘贴限制(U校园 iWrite)
published: 2023-10-30
category: 教程
tags: [browser, js]
# updated: 2023-10-30 11:21:29
# categories: [教程, 搞机]
---

## 前情提要

英格力士 Teacher 布置了两篇看图写作的作业，在 U 校园的 iWrite 平台上。都 3202 年了，这种东西当然是 GPT 直接 μ 杀。结果......

![image.png](https://img.085404.xyz/images/13c43a6233f7f5e1a809775a115ac7ce.webp)

当然，我敏锐的察觉到了地址栏那个大大的 `不安全http` 。心想这种臭鱼烂虾必有破解之法。苦寻油猴脚本无果的情况下，在另一个佬的博客里找到了答案

## 解决方案

先 `F12` 切开发者，然后定位到文本输入框

![image.png](https://img.085404.xyz/images/2c97c440d8e4c3865107f468bbbbc8dc.webp)

然后在右边的事件侦听器里，找到 paste 字段下的三个监听器，直接删了就行

![image.png](https://img.085404.xyz/images/4ec3a5bf95eab22eb06d65a8ab4be89b.webp)
