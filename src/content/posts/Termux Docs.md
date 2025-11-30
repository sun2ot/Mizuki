---
title: Termux Docs
published: 2024-06-14
category: 教程
tags: [Android, software, terminal, linux]
# updated: 2024-07-29 16:32:15
# categories: [教程, 搞机]
---

# Termux Docs

## 安装

[Termux-App GitHub]( https://github.com/termux/termux-app#github )

## 初始化

**修改镜像源：**

```
termux-change-repo
```

屏幕下方的上下左右选中修改 `Main Repo`，然后在二级菜单中选中 `tuna` 字样的源（清华源）

> 使用代理就不需要设置

**获取 root 权限（可选）：**

```
su
```

会弹出授权提示框，允许即可。

**安装 ssh 套件：**

```bash
pkg install openssh
```

如果安装后使用 `ssh` 指令报错，请继续安装 `openssl`

```
pkg install openssl
```

**安装 vim：**

```
pkg install vim
```

**访问 Android 外置存储：**

```bash
pkg upgrade
# Android >= 11 务必执行这一步
pkg install termux-am
termux-setup-storage
```

完成后 `~/` 目录下会多出一个 `storage` 文件夹，里面有几个软链接，分别链接到相册，下载等路径，其中的 `~/storage/shared` 对应 `storage/emulated/0/`。

## 修改字体

对于使用了 prompt 的 shell，往往需要额外字体的支持（例如 [NerdFont](https://www.nerdfonts.com/font-downloads)）。下面说明如何更换 Termux 的字体。

1. 下载所需要的字体文件，例如 `FiraCode.ttf`
2. 将该字体重命名为 `font.ttf` 并上传到 `/data/data/com.termux/files/home/.termux/font.ttf`
3. 重启 Termux 或者新建 session 即可生效

## 注意事项

> 仅针对 Android 14

1. termux 作为安卓 App，默认只能访问自有路径，即 `/data/data/com.termux/files/home`，等价于 Linux 下的 `/home/user`，故显示为 `~`。而 `/` 作为系统根路径，无 root 权限时无法访问。
2. 安卓外置存储，或者说常规模式下用户可以访问的路径，从 `/storage/emulated/0` 开始，其 shortcut 为 `/sdcard`