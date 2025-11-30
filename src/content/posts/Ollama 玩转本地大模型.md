---
title: Ollama 玩转本地大模型
published: 2024-09-11
category: 教程
# updated: 2024-09-24 16:29:40
# categories: [教程, 搞机]
---

## Ollama

[Ollama](https://ollama.com/) 是一款 [开源](https://github.com/ollama/ollama) 框架，专为本地部署和运行大语言模型（LLM）而设计。其特性与功能有很多，这里只列举几个核心点：

1. 简化部署：Ollama 可以让你用 Docker 的方式部署 LLM，这是什么概念不用我多说了吧
2. API 支持：无需额外的 coding 操作，Ollama 本身就支持 API 调用 LLM
3. 跨平台：主要针对 macOS 和 Linux，Windows 目前属于预览性支持
4. Python SDK 支持

Ollama 支持的模型可以在 [Ollama Library](https://ollama.com/library) 中检索。

### GPU 支持

我没玩过 A 卡，所以这里只记录 N 卡的情况。更多内容可参考 [Ollama GPU](https://github.com/ollama/ollama/blob/main/docs/gpu.md)。

> 大模型不坑穷人，所以请注意：运行 7B 模型需要至少 8GB 的显存，13B 模型需要至少 16GB，33B 模型需要至少 32GB。

Ollama 支持 compute capability (计算能力) 5.0+ 的 Nvidia GPU，如下表所示。如果不清楚你的 GPU 计算能力是多少，可在 [cuda-gpus](https://developer.nvidia.com/cuda-gpus) 查询。

| Compute Capability |       Family        |                                                             Cards                                                             |
| :----------------: | :-----------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|        9.0         |       NVIDIA        |                                                            `H100`                                                             |
|        8.9         |  GeForce RTX 40xx   | `RTX 4090` `RTX 4080 SUPER` `RTX 4080` `RTX 4070 Ti SUPER` `RTX 4070 Ti` `RTX 4070 SUPER` `RTX 4070` `RTX 4060 Ti` `RTX 4060` |
|                    | NVIDIA Professional |                                                     `L4` `L40` `RTX 6000`                                                     |
|        8.6         |  GeForce RTX 30xx   | `RTX 3090 Ti` `RTX 3090` `RTX 3080 Ti` `RTX 3080` `RTX 3070 Ti` `RTX 3070` `RTX 3060 Ti` `RTX 3060` `RTX 3050 Ti` `RTX 3050`  |
|                    | NVIDIA Professional |                      `A40` `RTX A6000` `RTX A5000` `RTX A4000` `RTX A3000` `RTX A2000` `A10` `A16` `A2`                       |
|        8.0         |       NVIDIA        |                                                         `A100` `A30`                                                          |
|        7.5         |   GeForce GTX/RTX   |                           `GTX 1650 Ti` `TITAN RTX` `RTX 2080 Ti` `RTX 2080` `RTX 2070` `RTX 2060`                            |
|                    | NVIDIA Professional |                          `T4` `RTX 5000` `RTX 4000` `RTX 3000` `T2000` `T1200` `T1000` `T600` `T500`                          |
|                    |       Quadro        |                                          `RTX 8000` `RTX 6000` `RTX 5000` `RTX 4000`                                          |
|        7.0         |       NVIDIA        |                                                `TITAN V` `V100` `Quadro GV100`                                                |
|        6.1         |    NVIDIA TITAN     |                                                     `TITAN Xp` `TITAN X`                                                      |
|                    |     GeForce GTX     |                     `GTX 1080 Ti` `GTX 1080` `GTX 1070 Ti` `GTX 1070` `GTX 1060` `GTX 1050 Ti` `GTX 1050`                     |
|                    |       Quadro        |          `P6000` `P5200` `P4200` `P3200` `P5000` `P4000` `P3000` `P2200` `P2000` `P1000` `P620` `P600` `P500` `P520`          |
|                    |        Tesla        |                                                          `P40` `P4`                                                           |
|        6.0         |       NVIDIA        |                                                  `Tesla P100` `Quadro GP100`                                                  |
|        5.2         |     GeForce GTX     |                              `GTX TITAN X` `GTX 980 Ti` `GTX 980` `GTX 970` `GTX 960` `GTX 950`                               |
|                    |       Quadro        |                             `M6000 24GB` `M6000` `M5000` `M5500M` `M4000` `M2200` `M2000` `M620`                              |
|                    |        Tesla        |                                                          `M60` `M40`                                                          |
|        5.0         |     GeForce GTX     |                                               `GTX 750 Ti` `GTX 750` `NVS 810`                                                |
|                    |       Quadro        |          `K2200` `K1200` `K620` `M1200` `M520` `M5000M` `M4000M` `M3000M` `M2000M` `M1000M` `K620M` `M600M` `M500M`           |

### 部署方式

> 下文以 Linux 为例

推荐使用脚本部署：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

[手动部署](https://github.com/ollama/ollama/blob/main/docs/linux.md#manual-install) 也不麻烦，如果有需要参考官方文档即可。

### 最佳实践

以最新的 Llama3.1 模型为例，部署该模型只需要：

```bash
ollama run llama3.1
```

搞定。

### 关于 API 的使用

这里纠正一个误区：执行 `ollama run model` 命令会进入 CLI 交互模式，此时可以与大模型进行对话。

但如果只是需要调用模型 API，执行 `ollama serve` 即可。此时 ollama 会监听本地的 11434 端口，并提供 RESTful API，此时 ollama 对系统占用可忽略不计。

可参考 [API 文档](https://github.com/ollama/ollama/blob/main/docs/api.md) 直接发起请求，ollama 会自动加载模型到 GPU 进行计算。如果一段时间内没有继续请求，**模型会自动卸载**。

### 环境变量

这里主要说明两个，一个是多 GPU 环境，另一个是局域网访问，这应该也是最常见的问题。

如果具有多 GPU 环境，ollama 会自动调用多 GPU 加速计算（前提是模型足够大）。但我相信富哥还是少数😭，更多的需求是指定 ollama 使用一个或几个特定的 GPU。

此外，ollama 默认工作在 `127.0.0.1` 上，可以通过 nginx 做反代访问，也可以通过环境变量 `OLLAMA_HOST` 设置。

常规情况下，安装 Ollama 后，可通过 systemd 管理其服务。因此可在 `/etc/systemd/system/ollama.service` 中添加上述环境变量，如下：

```bash
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="CUDA_VISIBLE_DEVICES=1"
Environment="OLLAMA_HOST=0.0.0.0"

[Install]
WantedBy=default.target
```

但如果处于容器环境，尤其是没有使用 systemd 的容器环境，默认情况下，ollama 完成后是不会自动启动的，如：

```bash
ollama list

Error: could not connect to ollama app, is it running?
```

此时可以在 shell 配置文件中添加环境变量，实现上述效果：

```bash
vim ~/.bashrc # ~/.zshrc

# 添加如下内容
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_MODELS=/home/user/ollama
```

然后手动启动 ollama：

```bash
nohup ollama serve > ollama.log 2>&1 &
# 如有需要，可执行
disown
```

## Open WebUI

如果只使用 Ollama，那么跟模型的交互仅限于 CLI 和 API 两种方式。如果想实现 chatgpt 类型的页面交互模式，需要借助额外的前端框架，可参考官方提供的 [Web&Desktop](https://github.com/ollama/ollama?tab=readme-ov-file#web--desktop) 目录。

下面以 Open WebUI 为例，推荐使用 Docker 进行部署：

```bash
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
```

> 注意：启动容器之前，需要先部署 [NVIDIA Container Toolkit](https://blog.085404.xyz/method/nvidia-container-toolkit.html)

这里不推荐本地的映射卷路径，实测会出现一些问题，例如：

```
huggingface_hub.utils._errors.LocalEntryNotFoundError: Cannot find an appropriate cached snapshot folder for the specified revision on the local disk and outgoing traffic has been disabled. To enable repo look-ups and downloads online, pass 'local_files_only=False' as input.
```

大概率是因为修改了映射卷位置所导致的，见 [open-webui issue: 2758](https://github.com/open-webui/open-webui/issues/2758)

## Ollama + LangChain

先画个饼，后面再写。