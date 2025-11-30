---
title: Obsidian图床图片处理方案
published: 2022-11-13
description: 本文叙述了多种情况下，对于obsidian的图片需求，采用何种图床方式解决更优。同时，针对常见的图床问题，如app访问不了、如何防盗刷等做出了回答。
category: 教程
tags: [obsidian, plugin, cdn]
# updated: 2023-06-04 10:58:15
# categories: [教程, 搞机]
---
## 情景一

### 背景

你准备将其他平台的文章迁移至 Obsidian

文章中的图片全部是对应平台的链接（如语雀）

你希望将这些链接对应的图片上传至你指定的图床/对象存储平台

### 操作

1. 下载`Image auto upload Plugin` 和 `Local images`（**两个都是插件**）
2. 使用`Local images`将文内图片下载至本地
	(如果你的需求仅仅是**将外链图片转化为本地图片**，你的操作到此为止即可实现需求)
>下载下来的图片默认存储到根路径下的`media`文件夹下
>>	该插件在进行此操作时，会自动将文内的图片链接替换为本地链接
>![](https://img.085404.xyz/images/d87785202eb381efd87a8e5c07be4682.png)


3. 再次对该文章，使用`Image auto upload Plugin`进行图片批量上传
>插件会自行嗅探文内的所有图片文件，并进行批量上传
>`Image auto upload Plugin`需配合**PicGo软件**才可完成上传操作
>![](https://img.085404.xyz/images/c10570a92d842ba9697f69c24dce8d9b.png)
4. 删除`media`文件夹即可
>如果不放心，也可以用`Clear Unused Images`清理一遍，看看`media/`是不是全部被清空

Tips： `Image auto upload Plugin` 一次只能处理一篇文章，而 `Local images` 可以处理库中所有文件，所以下载容易，上传难

## 情景二

此前一直将图片存储在本地

现在想将图片批量上传至云端

参照情景一，直接对该文章使用 `Image auto upload Plugin` 进行图片批量上传即可

## Q&A

### 图片名称格式问题

在默认情况下，不启用第三方插件时，无论是从哪里复制的图片，粘贴到 obsidian 中时都会被格式化为 `Paste image YYYY-MM-DD-HH-mm-SS` 的格式。其中，由于文件名包含空格，因此 md 文档中的图片链接将会以 `%20` 代替空格。

因此，部分人会担心这一行为是否会导致分享出去的 md 文档在其他 markdown 编辑器（如 typora）打开时，图片将无法加载的问题。其实无须担心， `20%` 就是 url 中空格符的转义字符，而你在 markdown 编辑器中输入的图片链接，本质上就是由编辑器（其实就是个浏览器）对该地址进行一次访问，**因此 obsidian 中的图片链接（只要不是 `wiki` 格式）通常是可以被其他软件识别的**。

具体介绍见[在http请求中，空格被encode成'+' or '%20的历史 - 夏敏的博客 | Anderson's Blog (jerey.cn)](https://jerey.cn/android/2019/01/27/Http%E5%8D%8F%E8%AE%AE%E4%B8%AD%E7%A9%BA%E6%A0%BC%E7%9A%84%E7%BC%96%E7%A0%81%E5%A4%84%E7%90%86/)


### 资源防刷防盗

如果使用的是对象存储（**不建议直接裸奔对象存储，非常危险！**），就在对象存储的设置里加上跨域规则。

如果使用的对象存储+cdn，就直接在 cdn 上加跨域设置。

```
# 头部设置
Access-Control-Allow-Origin

# 头部参数
app://obsidian.md
capacitor://localhost
http://localhost
```

除了上述设置，还需要开启防盗链。

> 防盗链的作用是，防止你放在 a.com/b.jpg 的文件，被张三盗用，然后放在他自己的站点，比如 b.xyz/b.jpg 。开启防盗链后，不在 a.com 域名下且针对 b.jpg 的请求，将会全部被无效。

```
你的域名1
你的域名2
...
obsidian.md
localhost

# 支持通配符 *，但 * 不可为空，例如下面两条规则并不是包含关系
*.domain.com
domain.com
```

**切记**，这里要加上 `obsidian.md` ，否则你的 obsidian app 是无法加载出来的！

至于防盗链中的空 refer，我一般是开启的。关闭之后好像有什么地方访问不了，不过写文的时候记不清了，反正开着就对了 QWQ。

最后是防止图床流量被盗刷的问题。如果你是买的第三方图床，比如什么“去不”之类的，那无所谓，反正成本不是你承担。如果你也是使用的对象存储，**务必上心这个问题！** 否则一晚上刷掉你几千块流量费是分分钟的事。

解决方案也很简单，挂载 cdn 后，给 cdn 加上各种限制，比如 5 分钟内流量封顶 1G、限速 1MB/s、超载后立即下线并且关闭对象存储的公开访问等等，基本就问题不大了。即使被盗刷，成本也不高，一杯 cola 钱足矣。







