---
title: 腾讯云 Coding DevOps 部署 Hexo
published: 2023-05-24
description: 通过集成化云端开发平台，实现 Hexo 博客资源发布到Git平台后，自动checkout代码并部署环境，构建出静态资源文件后，上传至腾讯云COS对象存储平台进行托管。
category: 教程
tags: [hexo, devops, 云计算, 自动化]
# updated: 2023-05-24 15:14:47
# categories: [教程, 搞机]
---

## 存储桶设置

创建存储桶

1. 公有读私有写（暂时，后续配置 CDN 即可私有读写）
2. 配置管理权限
   ![image.png](https://img.085404.xyz/images/24d233f0ac6ad98fb156835d93c1584b.webp)

> [!tip]
> 记录下这个子账户的 SecretId 和 SecretKey，后面要用

开启该存储桶的**静态网站**权限，否则你的 hexo 静态资源文件将无法作为 HTML 在公网预览。

![image.png](https://img.085404.xyz/images/630f110576751a62cff05284d24e06a8.webp)

## 自动化部署

### 创建构建计划

在腾讯云控制台搜索 `Coding DevOps`，点击 `立即使用`

![image.png](https://img.085404.xyz/images/9f0c3c2ac0fb47b2ac8c79448f88732d.webp)

进入后创建新项目

![image.png](https://img.085404.xyz/images/562430866018a7b23d9912fef2535846.webp)

按需选择三样即可

![image.png](https://img.085404.xyz/images/1eecb53765685fe85a04ee5bc995d7cc.webp)

关联 hexo 的代码仓库

![image.png](https://img.085404.xyz/images/0b893852cc75e48211539753a511b2a8.webp)

进入左侧菜单 `持续集成` ，然后 `创建构建计划`

![image.png](https://img.085404.xyz/images/afbad5f18115c944b7bfefd9ab570d2b.webp)

选择 `React + COS` 模板即可

> 只是要用它这个形式，因为和我们的需求有相当大的重复

![image.png](https://img.085404.xyz/images/c0f7c4acfcb1ca10a39c3058974a999d.webp)

- 计划名称随便设置
- 代码仓库选择**刚刚关联的**自己的仓库

![image.png](https://img.085404.xyz/images/37845e76434397905abe57e74f39fc80.webp)

不用纠结于依赖构建等指令，后面都是要改的。
Hexo 没有单元测试，故关闭。
上文记录下的存储桶的子用户信息，填在这里（见 `存储桶设置` - `配置管理权限` ）

![image.png](https://img.085404.xyz/images/27ed68e8c30f02aa5f81dda44289fb35.webp)

> [!warning]
> 记得取消勾选下面的立即构建，还有很多设置项没修改，构建必失败。

### 设置构建计划

#### 更新 Node.js

> [!bug]
> 截止本文编辑时，最新版 hexo 要求 Node. js>14，Coding 提供的构建节点是 v10，所以不更新会**构建失败**！

> 更多 Coding 环境版本说明见[默认节点环境｜ CODING DevOps](https://coding.net/help/docs/ci/node/env.html)

进入`设置`

![image.png](https://img.085404.xyz/images/6c769cea73b30f7e9b96570f7a7500d5.webp)

进入 `流程配置` ，选择 `文本编辑器`

![image.png](https://img.085404.xyz/images/6ec929ba649aee2a62d297f144465ced.webp)

添加一个新的 `stage`

```
stage('更新Node.js') {
  steps {
    sh 'rm -rf /usr/lib/node_modules/npm/'
    dir('/root/.cache/downloads') {
      sh 'wget -nc "https://coding-public-generic.pkg.coding.net/public/downloads/node-linux-x64.tar.xz?version=v16.13.0" -O node-v16.13.0-linux-x64.tar.xz | true'
      sh 'tar -xf node-v16.13.0-linux-x64.tar.xz -C /usr --strip-components 1'
    }
    sh 'node -v'
  }
}
```

注意添加的位置！

![image.png](https://img.085404.xyz/images/99c467f610a750e6fb36a67a86d4b42c.webp)

#### 安装依赖

切回到 `图形化编辑器` ，来到 `3-1 安装依赖` ，点击 `执行shell脚本` 。
将其内容修改为如下内容

> [!warning]
> 记得将主题部分，更换成你自己使用的主题。安装方式在你所用的主题官网上找。

> [!tip]
> 如果你没有修改主题的源文件，采用的是外部主题配置文件的方式修改主题，可以直接照抄我的作业。
>
> 如果你修改了主题的源文件，可以考虑上传到你自己的仓库里去。

```shell
# 安装hexo
npm install -g hexo-cli
# 安装依赖
npm install
# 安装主题
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

![image.png](https://img.085404.xyz/images/e92b97d58b43d2fc46a17845280f189b.webp)

#### 构建静态资源文件

操作同上，略

![image.png](https://img.085404.xyz/images/1be38ad38f24b26e1eb00329a59305ce.webp)

#### 上传到 COS

对应的 `5-1` 部分，**无需修改**。

![image.png](https://img.085404.xyz/images/a42b8f11103751dc8d3b17e5478472b2.webp)

> 配置完后，记得点击右上角 `保存`

### 修改触发规则

如果是 github 托管的代码，默认是 `main` ，不是 `master`

![image.png](https://img.085404.xyz/images/84e513591d7616e553bedfb66934b438.webp)

### 修改环境变量

将上传的文件夹修改为 `./public/`

![image.png](https://img.085404.xyz/images/6da87fd9eb749426256495e383411e6c.webp)

### 触发构建计划

有两种方式，一种是手动点击右上角 `立即构建` 。或者手动提交一次代码到 `main` 分支，就能触发上方设置的触发规则。

成功后，根据控制台打印的链接，即可访问。

![image.png](https://img.085404.xyz/images/5ab0d013c767a439ab05edcecc7ee47c.webp)

或者通过存储桶的访问节点进入也可。

![image.png](https://img.085404.xyz/images/630f110576751a62cff05284d24e06a8.webp)
