---
title: 文献管理软件 Zotero
published: 2023-06-06
category: 教程
tags: [software, CS]
# updated: 2023-06-06 16:22:22
# categories: [教程, 科研]
---


## 一、下载

[https://www.zotero.org/](https://www.zotero.org/)

一共包含两个部分，一个是 zotero 软件，还有一个是配套的插件（chromium 内核浏览器与 Firefox 均适配）

## 二、文献导入

### 1. 从 endnote 导出，再导入 zotero

如果之前用的 endnote，想转到 zotero，可以从 endnote 以 `bibtex` 格式导出为 `xml` 文件（没有 bibtex 选项就去 edit-output style 里面启用），然后将 `xml` 文件导入 zotero 即可。

![image. png](https://img.085404.xyz/images/88c86a89c01581bbc28628870a3834c8.webp)

![image.png](https://img.085404.xyz/images/1f9bc98122034dd0350a31eec56280f6.webp)

### 2. 从浏览器插件导入

任意进入一篇文献

![image.png](https://img.085404.xyz/images/5db8c1b5db7b330f7a5e5fdae1f29cd2.webp)

点击右上角 zotero 插件即可 `save to zotero`

![image.png](https://img.085404.xyz/images/2273afa8579f233d26711b849bc6126f.webp)

> 通常情况下，外文文献网站都没啥问题，中文文献都是问题。。。可通过github项目[Zotero translators 中文维护小组](https://github.com/l0o0/translators_CN)更新zotero转译组件（插件导入文献本质上就是js脚本，不过中国总是特色。。。）。还是无法获取文献的话请前往github提交issue。

### 3. 从剪切板导入（上述方法2不行的话，推荐这一种，也很方便）

以知网为例，引用文献时，以 endnote 格式导出，复制字符串

![image.png](https://img.085404.xyz/images/fc1d8969c3a452fbcf2bb97a2e77dc79.webp)

进入 zotero，选择 `从剪切板导入` ，或者快捷键 `ctrl + shift + alt + i` （**此快捷键非全局快捷键，需进入 zotero！**）

> 不是说非得按endnote格式导出，只是这个是老字号，国内外各平台都有罢了。其余的格式也可以试试，比如`Refworks`格式也是可以的。

![image.png](https://img.085404.xyz/images/621927603d27f292281e1b113b46ebf4.webp)

## 三、修改文献引用格式

进入 `首选项`

![image.png](https://img.085404.xyz/images/ac657159fc4d5d0ffbeaa064577bc82a.webp)

通常情况下，zotero 不会内置 `国标7714` （国内论文的参考文献格式，具体是哪个年份的，比如2005或者2015看你自己的需求），需要自行添加

![image.png](https://img.085404.xyz/images/911b1c6bf34790b3a95bcd09d329db43.webp)

在弹出的搜索界面检索 `gb/t` ，选择 `2005(numeric)` （通常情况下，高校都是顺序编码制，即 numeric）

![image.png](https://img.085404.xyz/images/de922d0fd3c6b4c032b85c7856f3aab6.webp)

### 自定义引用格式下载

[chinese-gb7714-2005-numeric.csl](https://www.aliyundrive.com/s/sDXRgJFCnpn)

## 四、word 中使用 zotero

zotero 安装成功后，word 中会新增插件选项卡

![image.png](https://img.085404.xyz/images/90ec812e53b8493710ad7d924c6e301e.webp)

> 注意 Citation 和 Bibliography 之间的区别：前者为引文，即正文中右上角的文献角标序号，后者为参考书目，即文末参考文献里面的具体文献。**选择** `Add/Edit Citation` **只会在正文中添加角标序号，需将光标移动至需要添加参考文献的段落，然后** `Add/Edit Bibliography` **即可。**

如果已经添加了部分文献，然后需修改他们的顺序，或者（例如）在[1]和[2]之间添加新的引文，直接add即可，zotero会自动更新全文的顺序（这也是为什么要用文献管理软件的重要原因之一！）
> 初次在word使用zotero时，会让你选择文献格式，选中**第三步**中添加的国标样式即可。

## 五、其他功能

zotero不仅是免费的，更是开源的！开源！这意味着它会拥有丰富的插件可供使用，见[zotero插件](https://www.zotero.org/support/plugins)。

除了插件以外，zotero还内置了一些常用功能。

### 1. 点击右上角图标可自行选择主界面的文献显示栏目

![image.png](https://img.085404.xyz/images/1040426842ac5576adb0d52b4d2250ca.webp)

### 2. 右侧的笔记可自行添加文献笔记

![image.png](https://img.085404.xyz/images/5fc62dc20d3f14fd581401a7d05b41f0.webp)

> 通过插件可支持`markdown`语法，操作见百度（本人野鸡本科，用不上）

### 3. 添加文献标签

见右侧栏

![image.png](https://img.085404.xyz/images/6f9cfed43a2e30130b765048aff3a12e.webp)

点击 `Add` 可任意添加若干标签，该标签可于页面左下角见

![image.png](https://img.085404.xyz/images/6f9cfed43a2e30130b765048aff3a12e.webp)

选择某个标签，可筛选出标记了该标签的所有文献

![image.png](https://img.085404.xyz/images/3728c44203e5dcbec27465a0b8720845.webp)
![image.png](https://img.085404.xyz/images/b517ba588922651e0a376e9279e7f2c2.webp)

> 这个功能还是挺好用的，每个技术对应的文献可以分别打上不同的tag。通过浏览器插件导入的文献有时会自带标签，可以删除后自行添加。

退出标签筛选，只需重新点击左下角的 tag 即可。

### 4. 同步

右上角同步按钮，点击后注册账户即可同步

![image.png](https://img.085404.xyz/images/fcbb3c81e62bb66943c5bad37ff1efa3.webp)

> 不清楚要不要翻墙，因为我7x24小时开着代理

同步内容包含两个，一是文献库，二是文件的附件（文献对应的 PDF、笔记等等）。后者可通过官方服务器同步，限额300M，也可以通过 webdav。

如果你真的有额外文件要同步，个人建议webdav，至于是dropbox还是坚果云或者别的什么，那就各有所好了。

## 六、FAQ

### 1. 参考文献中的外文作者名字全部是大写

[https://blog.csdn.net/qq_36501182/article/details/88666849](https://blog.csdn.net/qq_36501182/article/details/88666849)

### 2. 参考文献中的外文作者 lastname 为缩写

`.csl` 样式文件中，搜索 `initialize` （也有可能是 `initialize-with` ），将其修改为 `initialize="false"` 即可。
