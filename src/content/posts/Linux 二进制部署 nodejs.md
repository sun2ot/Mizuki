---
title: Linux 二进制部署 nodejs
published: 2024-03-10
category: 教程
tags: [linux, nodejs, env]
# updated: 2024-05-30 20:41:25
# categories: [教程, 软件工程]
---

## 下载

[Download | Node.js (nodejs.org)](https://nodejs.org/en/download)

下载 Linux Binaries (x64)并解压

```bash
wget https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz
tar -xJf node-v18.18.0-linux-x64.tar.xz -C /usr/local/
```

## 配置环境变量

修改 `~/.bashrc`

```bash
export PATH=/usr/local/node-v18.18.0-linux-x64/bin:$PATH
```

执行 `source ~/.bashrc` 生效

查看效果

```bash
node -v
npm -v
```


> [!warning] 
> 如果你是非 root 用户，切记 export 的路径不要用 `~` ，否则会出现 `node -v` 正常但 `npm -v` 失败的奇怪情况。原因是 `npm` 默认情况下是使用 `node` 去执行的，而你导出的路径为 `~` ，因此系统会去 ` /usr/bin ` 下寻找 `node` 的。而一旦管理员没有安装 `node` 环境的话，那你是无法使用 `node` 去调用 `npm` 的。

