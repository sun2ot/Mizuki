---
title: Windows Terminal 优化
published: 2023-05-28
description: 在Windows平台配置scoop包管理工具，并借助其为PowerShell安装模块，以提升使用体验感，达到类zsh的效果。
category: 教程
tags: [windows, software, scoop, powershell]
# updated: 2023-05-28 16:03:21
# categories: [教程, 搞机]
---

## Scoop

> 官网：[Scoop](https://scoop.sh/)

### 下载

```powershell
# 下载安装脚本
irm get.scoop.sh -outfile 'install.ps1'

# 查看所有可设置项
.\install.ps1 -?
```

> [!tip] 
> 原脚本在 github 上，如果天朝环境下载不同，可以添加代理参数
> `irm get.scoop.sh -Proxy 'http://<ip:port>' -outfile 'install.ps1'`

脚本下载后的存储路径取决于**当前命令行的所在路径**。

### 安装

[ScoopInstaller/Install: 📥 Next-generation Scoop (un)installer (github.com)](https://github.com/ScoopInstaller/Install#readme)
可以自定义 scoop 的安装路径，以及通过 scoop 下载的软件的路径

```powershell
.\install.ps1 -ScoopDir 'D:\Applications\Scoop' -ScoopGlobalDir 'F:\GlobalScoopApps' -Proxy 'http://ip:port'
```


### 设置下载代理

```powershell
scoop config proxy ip:port
```

不要加协议，如 `http://xxx`


### 下载软件

```powershell
scoop search name
scoop install name
```



## gsudo

> 项目地址：[gerardog/gsudo: Sudo for Windows (github.com)](https://github.com/gerardog/gsudo)

Windows 出于安全性等问题考虑，是不允许直接将 shell 切换为管理员模式的，因此有时会出现如下尴尬场景：

1. 有的指令需要管理员权限，但已经进入路径了才想起来，必须重新开新窗口再一路 cd 进来；
2. 为了图方便，将 terminal 设置为了**默认以管理员权限启动**。但有的指令又不可以在管理员权限下执行，此时再想简单启动普通环境就做不到了，必须重新去 terminal 里设置。

`gsudo` 是一个 powershell 模块，可以很好的解决这个问题。安装好后，可以像 Linux 下的 `sudo` 一样，直接提权！

### 安装

```powershell
# 安装
scoop install gsudo
```

### 配置

在 Windows PowerShell 的 `$profile` 中添加一行如下内容使模块生效

1. 打开 `$profile`

```powershell
# 电脑装了 vscode 就用这个
code $profile
# 没有 vscode 就用这个
notepad $profile
```

2. 插入

```powershell
# 插入内容
Import-Module (Get-Command 'gsudoModule.psd1').Source
```

**重启** terminal 即可。

> 不知道 `$profile` 是啥？见我之前的 [oh-my-posh 命令行美化](https://blog.085404.xyz/oh-my-posh.html#%E9%85%8D%E7%BD%AE)


## z.lua

> 国人开发，见 [z.lua/README.cn.md at master · skywind3000/z.lua · GitHub](https://github.com/skywind3000/z.lua/blob/master/README.cn.md)

> [!quote]
> z.lua 是一个快速路径切换工具，它会跟踪你在 shell 下访问过的路径，通过一套称为 Frecent 的机制（源自 FireFox），经过一段简短的学习之后，z.lua 会帮你跳转到所有匹配正则关键字的路径里 Frecent 值最高的那条路径去。

说人话就是，你再也不用被 `cd` 折磨了！

### 安装

```powershell
# 安装
scoop install z.lua
```

`z.lua` 是需要 `lua` 环境的。但包管理器的优势就在这里，你不需要去考虑依赖问题， `scoop` 会帮你自动下载并配置 `lua` 。

### 配置

同上文一样，在 `$profile` 中添加一行

```powershell
Invoke-Expression (& { (lua '/path/to/z.lua' --init powershell) -join "`n" })
```

将你的 `z.lua` **文件路径**替换进去即可。安装路径在上文安装 `scoop` 时曾设置过。如果你没设置，或者不记得了，可以通过以下指令**查看某个指定 app 的路径**

```powershell
scoop prefix z.lua
```

> [!warning] 
> 该指令只会显示到父路径，而配置 `z.lua` 需要指定具体的文件路径。

同样，别忘了重启 terminal。以下是效果演示

![演示效果](https://img.085404.xyz/images/396400dc51df7c9a88b89c3b7df55a62.gif)


