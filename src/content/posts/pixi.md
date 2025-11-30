---
title: pixi
published: 2025-08-22
category: 教程
# updated: 2025-08-28 09:24:02
# categories: [教程, 软件工程]
---

## 安装

```bash
curl -fsSL https://pixi.sh/install.sh | sh
```

上述调用将自动下载最新版本的 `pixi` 并解压，然后将 `pixi` 二进制文件移动到 `~/.pixi/bin` 。该脚本还会扩展 shell 启动脚本中的 `PATH` 环境变量，使其包含 `~/.pixi/bin` 。

完成后可添加 shell [自动补全](https://pixi.sh/latest/installation/#autocompletion)：

```bash
# bash
eval "$(pixi completion --shell bash)"

# zsh
autoload -Uz compinit && compinit # redundant with Oh My Zsh
eval "$(pixi completion --shell zsh)"

# powershell
(& pixi completion --shell powershell) | Out-String | Invoke-Expression
```

## 初始化

- 如果是新建项目，可执行 `pixi init project_name`
- 如果是已有的项目，可执行 `pixi init`

两者都会在项目路径下生成 `.gitattributes`，`.gitignore`，`pixi.lock` 和 `pixi.toml`。

## 安装与卸载包

可通过 `add` 命令添加包：

```bash
pixi add python=3.10
```

默认情况下，pixi 会使用 `conda-forge` 作为安装渠道。对于只提供 `pypi` 渠道的包，可以通过：

```bash
pixi add xxx --pypi
```

上述操作均会更新 `pixi.toml`，在 `dependencies` 表中添加键值对，例如：

```toml
[dependencies]
python = "3.10.*"
rasterio = ">=1.4.3,<2"
nvitop = ">=1.5.3,<2"
```

卸载通过如下方式：

```bash
pixi remove numpy
```

## 环境与激活

需要声明的是，在 pixi 中，每个项目的环境都是独立的，依赖于配置文件。但包本身只会被下载一次，并缓存在中央存储中，所有项目的环境通过硬链接产生，存储在**工作区**下的 `.pixi` 中。区别于 conda，pixi 支持对于同一个项目产生不同的环境。默认的环境为 `.pixi/envs/default`。

类似于 `conda activate` ，pixi 通过 `pixi shell` 来激活当前环境，这取决于在哪个工作区下的 `pixi.toml`。

当然，也可以选择不激活环境，而是直接通过 `pixi run python xxx` 来执行任务。

更多的区别，推荐阅读 [官方文档](https://pixi.sh/latest/switching_from/conda/#key-differences-at-a-glance)，这一节很清楚的讲明了 pixi 的工作方式去其他工具有何不同。

## 缓存

pixi 会将下载的所有包存储在中央缓存中，不同操作系统对应的路径如下：
- Linux： `$XDG_CACHE_HOME/rattler` 或 `$HOME/.cache/rattler`
- macOS: `$HOME/Library/Caches/rattler`  
- Windows: `%LOCALAPPDATA%\rattler`  

而工作区中的 `.pixi` 里的包通过硬链接共享中央缓存。可以通过设置 `PIXI_CACHE_DIR` 或 `RATTLER_CACHE_DIR` 环境变量来配置此位置。

## pixi 配置

[官方文档](https://pixi.sh/latest/reference/pixi_configuration)

### 配置文件

pixi 的配置与工作区的配置是两个东西。pixi 的配置优先级可参考 [The Configuration of Pixi Itself](https://pixi.sh/dev/reference/pixi_configuration/#the-configuration-of-pixi-itself)。

简单来说，通常情况下在 `$HOME/.pixi/config.toml` 中添加 pixi 配置即可，可保证相对较高的优先级且与工作区配置解耦。

### 镜像与代理

先说代理的问题，pixi 会优先考虑 `https_proxy` 等代理环境，并赋予其最高优先级。所以建议直接配置即可。

pixi 的常用镜像包括 pypi 和 conda 两部分，`config.toml` 的配置方式如下：

```toml
[mirrors]
"https://conda.anaconda.org/conda-forge" = [
  "https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/",
]
"https://repo.anaconda.com/pkgs/main" = [
  "https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/",
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/main",
]
"https://repo.anaconda.com/pkgs/r" = [
  "https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r",
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/r",
]
"https://repo.anaconda.com/pkgs/msys2" = [
  "https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2",
  "https://mirrors.ustc.edu.cn/anaconda/pkgs/msys2",
]
"https://repo.anaconda.com/pkgs/free" = [
  "https://mirrors.sustech.edu.cn/anaconda/pkgs/free"
]
"https://repo.anaconda.com/pkgs/pro" = [
  "https://mirrors.sustech.edu.cn/anaconda/pkgs/pro"
]


[pypi-config]
index-url = "https://mirrors.aliyun.com/pypi/simple"
extra-index-urls = ["https://pypi.tuna.tsinghua.edu.cn/simple"]
```

> 由于 Pytorch 官方已不再对 Anaconda 的 pytorch channel 提供支持，因此上述镜像没有添加清华与南科大的 pytorch/nvidia 渠道。

## 系统需求

`system-requirements` 可以告诉 pixi 安装和运行工作区环境所需的系统规格。确保依赖项与计算机的操作系统和硬件相匹配。

```toml
[system-requirements]
linux  = "4.18"
libc   = { family = "glibc", version = "2.28" }
cuda   = "12"
macos  = "13.0"
```

默认情况下，Linux 环境的系统需求如下：

```toml
[system-requirements]
linux = "4.18"
libc = { family = "glibc", version = "2.28" }
```

所以如果使用 Ubuntu 18.04 等 old distribution，注意修改 libc 的版本。

## Pytorch 的安装

[官方文档](https://pixi.sh/latest/python/pytorch/)

官方建议使用 conda-forge 通道来安装 pytorch。至于 Anaconda 的 pytorch 渠道，目前不再支持，参考 [Deprecating PyTorch’s official Anaconda channel]( https://github.com/pytorch/pytorch/issues/138506 )。当然，使用 pypi 来安装 pytorch 永远是可行的。

需要注意的是，pixi 安装 pytorch 时，需要指定 system requirements（即 CUDA），否则将安装 CPU 版本：

```toml
[system-requirements]
cuda = "11"
```

> [!warning] 
> `system-requirements` 仅用于确保依赖 `__cuda >= {version}` 的软件包能够被正确解析，但无法指定特定的 CUDA 运行时版本。

如果需要限制 CUDA 的具体版本，可以通过 `cuda-version` 包来限制：

```toml
[dependencies]
pytorch-gpu = "2.0.0"
cuda-version = "11.8"
```

这会直接影响安装的 `cudatoolkit` 的版本。

将上述内容添加到工作区的 `pixi.toml` 后，使用 `pixi install` 即可更新环境依赖。

## 多环境

在 pixi 中，有三个层级概念：`environment > feature > dependencies`。dependencies 表示依赖包，若干个依赖包可以形成一个 feature，若干个 feature 可以组合成一个 environment。

项目初始化所产生的 `.pixi/envs/default` 本身就是一个名为 `default` 的 `feature`，换言之：

```toml
# 根据feature创建环境

[environments]
# implicit: default = ["default"]
default = ["py39"] # implicit: default = ["py39", "default"]
```

如果需要创建一个新的 feature，可通过：

```bash
pixi add --feature dev --pypi matplotlib==3.8 ipykernel
```

即创建了一个名为 `dev` 的 feature，其具有两个 dependencies：matplotlib 和 ipykernel。这会在 `pixi.toml` 中添加如下内容：

```toml
[feature.dev.pypi-dependencies]
matplotlib = "==3.8"
ipykernel = "*"
```

基于上述过程，可以将若干个 feature 组合成一个 environment：

```toml
[environments]
dev = {features = ["default", "dev"]}
```

然后执行 ` pixi install -e dev` 即可创建新的环境。其中 `dev` 环境包含了 `default feature` 中的所有 `dependencies`，还额外具有 matplotlib 和 ipykernel 两个包。

### solve-group

当 pixi 解析依赖关系时，它会为每个独立的环境计算出一组满足所有版本约束的、具体的包版本，并将结果写入 `pixi.lock` 文件。通常情况下，每个环境的解析是独立进行的。

然而，在某些情况下，不同环境之间可能会因为各自特有的依赖而导致解析器为同一个共享依赖选择了不同的版本。这在生产/测试环境下可能是个问题。`solve-group` 的可以**确保多个不同环境中的共享依赖包版本完全一致**。通过将多个环境放入同一个 `solve-group`，等于在告诉 Pixi：“请把这些环境看作一个整体来解析它们的依赖关系，并确保它们共有的那些包版本是完全相同的。”

```toml
[environments]
# 为 default 环境和 dev 环境定义 solve-group
default = {features = ["default"], solve-group = "prod"}
dev = {features = ["default", "dev"], solve-group = "prod"}
```