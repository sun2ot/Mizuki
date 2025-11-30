---
title: VSCode 美化
published: 2024-04-28
category: 教程
tags: [beautify, vscode]
# updated: 2024-05-06 11:09:40
# categories: [教程, 软件工程]
---

# VSCode 美化

## 前情提要

最近被学弟安利了一个开源项目 [ServiceLogos](https://github.com/SAWARATSUKI/ServiceLogos)，是一个各类开发语言与 IDE 的 Logo 设计仓库。

所以想了想，老登也要跟上时代！美化的尽头是默认，但首先要开始美化😁

## 插件安装

众所周知，VSCode 的本质就是一个~~浏览器~~ IDE，你可以在里面写代码、~~看动漫~~、~~看小说~~，而这些的前提都是基于各种各样的插件。因此，首先安装以下两个插件：

```
名称: Custom CSS and JS Loader
ID: be5invis.vscode-custom-css
说明: Custom CSS and JS for Visual Studio Code
版本: 7.2.1
发布者: be5invis
VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css
```

```
名称: Background
ID: Katsute.code-background
说明: The most advanced background image extension for VSCode
版本: 2.10.2
发布者: Katsute
VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=Katsute.code-background
```

## 美化设置

### 背景

`Ctrl + Shift + P`，搜索 `Background: Configuration`，有四个组件的背景可以设置：

1. Window（整个窗口）
2. Editor（编辑器）
3. Sidebar（侧边栏）
4. Panel（各种弹出窗口）

选中你要修改的组件，然后选择一张图片即可。

### Logo

`Ctrl + Shift + P` - `Open User Settings`

在 `settings.json` 中插入一行：

```json
"vscode_custom_css.imports": ["file:///D:/snippets/vscode-custom/logo.css"]
```

这里的 `file:///` 是文件协议，指向你的自定义 css 文件，该文件如下：

```css
.editor-group-watermark > .letterpress{
  background-image: url("image.link") !important;
  opacity: .75;
  aspect-ratio: 3/2 !important;
}
```

将其中的 `image.link` 替换为 Logo 图片的链接，可以是 [ServiceLogos](https://github.com/SAWARATSUKI/ServiceLogos) 中的 raw link，也可以将图片转为 [base64](https://www.jyshare.com/front-end/59/) 后替换进去。如果网络环境无法直连 github，建议选择 base64 方案。

## 最终效果

![image.png](https://img.085404.xyz/images/344c5bc10a13e84ac969f714c2fc749b.webp)
