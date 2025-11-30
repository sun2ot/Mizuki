---
title: oh-my-posh 命令行美化
published: 2023-05-20
description: 在Windows/Linux平台下，使用oh-my-posh工具，对各自平台的命令行进行美化，或者自定义代码高亮提示信息。
category: 教程
tags: [windows, linux, powershell, beautify]
# updated: 2023-05-20 19:18:04
# categories: [教程, 搞机]
---


## Windows

### 安装

三种方式：

1. Microsoft Store 搜索 `oh-my-posh`
2. `winget install JanDeDobbeleer.OhMyPosh -s winget`
3. [Releases · JanDeDobbeleer/oh-my-posh (github.com)](https://github.com/JanDeDobbeleer/oh-my-posh/releases)

> [!tip]
> winget 经实测，会下载 `oh-my-posh.exe` 和主题包两样。
> 
> 微软商店没有试过，请自行尝试，如果没有主题包请前往 github 手动下载 `themes.zip` 。
> 
> 我个人喜欢去官方 release 页手动下载这两个文件。

> [!warning] 
> 手动下载请注意给 `oh-my-posh.exe` 配置环境变量


### 配置

官方在[这里](https://ohmyposh.dev/docs/installation/customize#config-syntax)给出了各个命令行工具的配置方法。本文只介绍 `Windows PowerShell` （PowerShell）其实也通用。

打开 `Windows PowerShell` 

```powershell
>>>$profile
D:\文档\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```

在上面的路径下创建这个 `.ps1` 文件（通常情况下应该是没有的）。这个就是你当前所用 terminal 的配置文件，在每次启动 terminal 时会预先加载该文件。

```powershell
oh-my-posh init pwsh --config {json主题路径} | Invoke-Expression
```

在 `.ps1` 文件中添加上述内容，保存后重启 terminal 即可。

![image.png](https://img.085404.xyz/images/44d0aac93afa153c11b535df55562792.png)


> [!tip] 
> 为什么说 PowerShell 也通用，你把上面的操作流程，打开 PowerShell 重复一遍就行了，无非就是那个 `.ps1` 配置文件的路径不一样而已。



### 主题路径问题

如果是 `winget` 安装的，主题包**好像是**在 `C:\Users\你的win名字\AppData\Local\oh-my-posh\xxx` （所以我为啥手动装，微软啥都往 C 盘塞）。

如果你是手动安装的，那主题包就是你解压 `themes.zip` 的地方。

主题样式预览见 [Themes | Oh My Posh](https://ohmyposh.dev/docs/themes)


## Linux

> 我用的是 Debian10，其余系统应该差异不大。

安装

```bash
curl -s https://ohmyposh.dev/install.sh | bash -s
```


配置文件添加： 

```
eval "$(oh-my-posh init bash --config ~/M365Princess.omp.json)"
```

> [!tip] 
> 上面那个 json 文件的主题也是要自己手动下载的，官方给的脚本不会帮你下载主题包。

## 字体问题

如果你查看官方文档，会反复看见他们推荐你下载[Nerd Fonts](https://www.nerdfonts.com/font-downloads) 。这个字体除了基本的文字外，还包含一些特殊符号或者小图像，如果你的 terminal 不支持这些样式，可能就会**显示成一个方框或者乱码**。

具体下载哪一个，随你喜欢就好。

这个字体并不需要在 `PowerShell` 或者 `bash` 这类命令行中配置，而是需要在你的终端 `Terminal` 中配置。

> [!danger] 
> 我就跟个傻逼一样，倒腾了几个小时的 Debian 系统字体更换，最后发了个 issue，人家 3 分钟不到就给我解决问题了

[How to make Nerd Font work on Debian's bash? · Issue #3884 · JanDeDobbeleer/oh-my-posh (github.com)](https://github.com/JanDeDobbeleer/oh-my-posh/issues/3884)


所以说，你在百度/Google 上看到的 Linux 使用 oh-my-posh 教程，10 个有 9 个是 Ubuntu，9 个里有 8 个在互相 copy，也是 nm 离谱...

其实一般情况下，**只需要在 Windows 平台安装 Nerd Font 字体就行了**，然后在你的 ssh 连接工具（Windows Terminal, Tabby, Alacritty, Electerm 等）中配置字体显示就行了。**Linux 平台压根不用装字体**。

说的就是下面这种

> [!error] 
> ```bash
>  sudo mkdir /usr/share/fonts/ttf
>  sudo cp *. ttf /usr/share/fonts/ttf
>  cd /usr/share/fonts/ttf
>  sudo chmod 744 *
>  sudo mkfontscale
>  sudo mkfontdir
>  sudo fc-cache -f -v
> ```
