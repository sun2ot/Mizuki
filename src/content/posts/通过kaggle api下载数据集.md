---
title: 通过kaggle api下载数据集
published: 2024-03-24
category: 教程
tags: [Python, dataset, cli]
# updated: 2024-03-24 16:47:04
# categories: [教程, 科研]
---

## 获取 Token

点击右上角头像，菜单中进入 `Settings`

![image.png|200x250](https://img.085404.xyz/images/c0e351ceeccdd0343f7bb5fc2ac237d4.webp)

点击 `Create New Token` 生成新的 Token，浏览器会自动下载鉴权文件：


![image.png](https://img.085404.xyz/images/452f1905933f89f5511b7e7ef3f48ce3.webp)

![image.png](https://img.085404.xyz/images/bf71c933b12876accbfeb6efc6202271.webp)


注意这句话：`Ensure kaggle.json is in the location ~/.kaggle/kaggle.json to use the API.`，意思是需要将下载的 `kaggle.json` 放到 Linux 服务器的 `~/.kaggle/` 下。

```bash
cd ~
mv -r kaggle.json ~/.kaggle/
```

## 下载数据集

首先下载 kaggle 指令：

```bash
pip install kaggle
```

在 kaggle 上找到要下载的数据集首页，然后点击右上角菜单，复制 API 指令：

![image.png](https://img.085404.xyz/images/6e42b7021108d4ed9ef313330b930eb2.webp)

复制的指令如下：

```bash
kaggle datasets download -d yelp-dataset/yelp-dataset
```

### 下载指定版本数据集

下拉 kaggle 数据集页面，在页面的右侧会看到 `Data Explorer`。默认情况下下载的是最新版数据集。

![image.png](https://img.085404.xyz/images/64aaa23b0d1a943960c9493c81634dc8.webp)

以图中的 `yelp` 数据集为例，我并不需要最新的 `yelp` 数据集，而是 `yelp2018`。因此点击图中的 `Version 4`，在弹出窗口中选择想要的版本即可。

但比较蛋疼的是，经过本人的不屑研究，没有找到通过 kaggle api 下载历史版本数据集的方法（我指的是 kaggle CLI）。因此迫不得已，只能使用邪术了。

1. 在服务器[部署 aria2](https://blog.085404.xyz/method/aria2.html)
2. `F12` 大法进入浏览器开发者页面，然后点击下载，从 `网络` 选项卡找到下载链接并复制（如果有 idm 等插件直接嗅探就行了）
3. 用服务器通过 aria2 下载




