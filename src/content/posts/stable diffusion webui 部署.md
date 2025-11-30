---
title: stable diffusion webui 部署
published: 2024-08-05
category: 教程
tags: [sd, AIGC]
# updated: 2024-08-06 15:05:38
# categories: [教程, 搞机]
---

# stable diffusion webui 部署

> Windows 的就不介绍了，一是因为使用 Windows 大部分是个人机，具有完全操作权限，因此没什么操作难度；二是相关的资料实在太多。

## 准备工作

1. 代理环境（没有也不是不行，不过稍微麻烦点，下文会给出解决方案）
2. `git`
3. 具有**较新**版本驱动的 NVIDIA GPU（我的服务器使用的 `Driver Version: 535.183.01   CUDA Version: 12.2`）
    - 不要用最新的，因为大概率不兼容
4. `conda/mamba` 环境

## 部署过程

首先创建一个 Python 3.10.6 版本的虚拟环境：

> 必须是这个版本

```bash
conda create -n sdw python=3.10.6
conda activate sdw
```

然后克隆仓库（这是原版的 sdw，不是第三方的）：

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
```

下载依赖和模型：

```bash
cd stable-diffusion-webui
./webui.sh
```

## 问题说明

理论上说，在网络和驱动没有问题的情况下，按照上述部署过程，等一段时间后就可以正常启动 sd webui。但多数情况下不会如此顺利，所以这里对几个常见的问题做出说明。

### 关于代理

如果你知道如何在 Linux 部署 clash 等代理客户端，那么只需要在执行依赖安装前，执行

```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890;
```

此后无论是从 GitHub 还是 hugging face 下载，都会走代理环境。

如果你不清楚这是什么，那就按照“依赖安装”一节中的内容逐步操作。

### 依赖安装

从事深度学习的可能会发现一个问题，sd webui 使用的是 Python 自带的 venv 虚拟环境，这玩意显然是没有 conda/mamba 好用的，那可不可以将依赖安装在后者然后启动呢？

经过实测以及检索各方信息，我的建议是别这么干，原因如下：

1. 代码能跑时，就不要去改它，这个道理 coder 应该都懂
2. 我试图通过 `pip install -r requirements.txt` 在 conda 环境中预先下载环境，也确实能跑起来，但就本质来说，隔离环境这一点跟 venv 没有区别啊
3. 此外，许多功能官方都封装在了 `webui-user.sh/bat` 的参数中。如果选择 conda 环境，将舍弃这一便利性，需要自行修改代码中相关参数。

综上，与其不断试错，不如配置好镜像和代理，使用 `./webui.sh` 安装。

```
# pip 镜像
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

由于该模型需要从 hugging face 下载，所以这里建议手动从 [镜像站](https://hf-mirror.com/runwayml/stable-diffusion-v1-5/blob/main/v1-5-pruned-emaonly.safetensors) 下载，然后移动到项目路径下的 `models/Stable-diffusion`。

> 由于模型文件较大，下载完成后记得校验 sha256 以确保文件未损坏。

上述工作完成后，执行 `./webui.sh` 等待即可。

如果依赖安装完成后，启动时报错 torch 相关错误，请检查以下两点：

1. 驱动版本是否合适（驱动版本太老，你又不是管理员，那还是歇了吧）
2. 参考下文“torch 版本”一节

### 局域网访问

默认情况下，sd webui 运行在 `127.0.0.1:7860`，不支持本机以外设备访问。可以修改 `webui-user.sh` 中的 `COMMANDLINE_ARGS` 解决：

```
export COMMANDLINE_ARGS="--listen"
```

修改后重启 sd webui，将会在 `0.0.0.0:7860` 上启动。

### 关于 GPUs

稳定扩散模型 stable diffusion 本质上**不支持跨多个 GPU 的并行工作**，见 [issue 11646](https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/11646)。但如果你有多个 GPU，想运行多个 sd webui 实例，或者想让 sd webui 运行在某个指定的 GPU 上，可以通过 `--device-id` 参数实现：

```
export COMMANDLINE_ARGS="--device-id 1"
```

> 注意，`export COMMANDLINE_ARGS="--device-id 0,1"` 是错误的，不可识别。

### torch 版本

sd webui 所需要的 pytorch 版本，按照 `nvidia-smi` 显示的 cuda 版本去下载，而不是 `nvcc -V` 所显示的 Runtime API 版本。

至于哪个版本可用，这是一个经验论问题，反复试错即可。

## 所有参数

https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Command-Line-Arguments-and-Settings

