---
title: sd 美化二维码
published: 2024-08-01
category: 教程
tags: [sd, AIGC]
# updated: 2024-08-02 20:44:21
# categories: [教程, 搞机]
---

# sd 美化二维码

## 二维码生成

这一步借助 webui 的插件 [qrcode-toolkit](https://github.com/antfu/sd-webui-qrcode-toolkit) 实现。

## controlnet 模型

先下载 [webui controlnet](https://github.com/Mikubill/sd-webui-controlnet) 插件，然后下载两个控制模型：

1. qrcode moster：
    - [control_v1p_sd15_qrcode_monster.yaml](https://hf-mirror.com/monster-labs/control_v1p_sd15_qrcode_monster/blob/main/control_v1p_sd15_qrcode_monster.yaml)
    - [control_v1p_sd15_qrcode_monster.safetensors](https://hf-mirror.com/monster-labs/control_v1p_sd15_qrcode_monster/blob/main/control_v1p_sd15_qrcode_monster.safetensors)
2. latentcat/latentcat-controlnet：
    - [control_v1p_sd15_brightness.safetensors](https://hf-mirror.com/latentcat/latentcat-controlnet/blob/main/models/control_v1p_sd15_brightness.safetensors)

这三个文件都放在 `extensions/sd-webui-controlnet/models` 下。

> 给出的链接都是 hugging face 的镜像站，直接下载即可。

然后按照下文使用 API  Key 下载基底大模型 [ReV Animated](https://civitai.com/models/7371/rev-animated)。注意，Overview 中推荐搭配 VAE 和 Negative Prompt Embeddings 使用，我这里仅加载了一个 [orangemix.vae.pt](https://huggingface.co/WarriorMama777/OrangeMixs/blob/main/VAEs/orangemix.vae.pt)。

关于 controlnet 的参数说明，可以参考如下视频，这里不过多赘述：

<iframe width="560" height="315" src="https://www.youtube.com/embed/HyQxGnQNAHI?si=gQq49tUCN4iX-l7K" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

如果只是想关注如何用 stable diffusion webui 实现二维码生成，那建议直接看这个视频：

<iframe width="560" height="315" src="https://www.youtube.com/embed/4CCZlwF4mro?si=plUcnKaspeHFUAfJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### 使用 civitai API

有的模型 C 站要求登录后才能下载，因此直接 download 直链是不 work 的，需要使用 API Key。

按照路径：右上角头像 ➡️ Account settings ➡️ API Keys，新增一个 API Key。

> [!caution] 警告
> 虽然约定俗成但还是说一句：注意页面上的提示，弹出的 API Key 只会出现一次，记得保存下来。

按照如下格式在下载链接中添加 `token` 参数即可下载：

```bash
wget "https://civitai.com/api/download/models/425083?type=Model&format=SafeTensor&size=full&fp=fp32&token=xxx" --content-disposition
```

> 主要是 `&token=xxx`

## FAQ

报错 `Expecting value: line 1 column 1 (char 0)`

该问题与代理有关，关闭代理后重启即可。如果不想关闭代理，可修改 `webui-user.bat`，添加参数 `--no-gradio-queue`

```
set COMMANDLINE_ARGS=--no-gradio-queue
```

> Linux 类似地修改 `webui-user.sh` 即可。

