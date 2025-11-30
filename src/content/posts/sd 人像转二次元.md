---
title: sd 人像转二次元
published: 2024-08-06
category: 教程
tags: [sd, AIGC]
# updated: 2024-08-06 15:05:28
# categories: [教程, 搞机]
---

# sd 人像转二次元

## 提示词反推

文生图的流程是给提示词然后生成对应图片，而如果要将一个人像转为二次元，一个靠谱的方案是先获得这个人像对应的提示词，这能帮助 sd 模型生成的图像尽可能贴近原图像。

对于 sd webui，这需要提示词反推插件来实现：

```
https://github.com/67372a/stable-diffusion-webui-wd14-tagger.git
```

原本的 [wd14 tagger](https://github.com/toriato/stable-diffusion-webui-wd14-tagger)（也就是你在网上各种教程、视频里看到的那个插件）已经 public archive 了，所以上面提供的是一个近期更新过的可用版本。

![image.png](http://img.085404.xyz/images/8eac1b85e78226f28cb91d6e866ede1e.webp)

安装完成后进入 Tagger 选项卡，按照上图所示操作，会自动下载反推所需模型。

> 自动从 hugging face 下载，需要代理环境。

将生成的正向提示词 Send to txt2img 后，点击 Unload all interrogate models 卸载反推模型以节省显存占用。

## controlnet 模型

具体的操作流程参考教程： https://www.uisdc.com/stable-diffusion-27

下面主要给出这个教程涉及到的模型资源（涉及下载部分需代理环境）：

1. Preprocessor 1：
    - openpose_full：下拉菜单选中预处理器后，点击右侧按钮自动下载
    ![image.png](http://img.085404.xyz/images/cb23d40373b3e284adeb1f7a38dd3eb1.webp)
    - 对应的 Model：[control_sd15_openpose.pth](https://huggingface.co/lllyasviel/ControlNet/blob/main/models/control_sd15_openpose.pth)
2. Preprocessor 2：
    - softedge_pidinet：与 openpose_full 相同，选中后点击自动下载
    - 对应的 Model：[control_v11p_sd15_softedge.pth](https://huggingface.co/lllyasviel/ControlNet-v1-1/blob/main/control_v11p_sd15_softedge.pth) 和 [control_v11p_sd15_softedge.yaml](https://huggingface.co/lllyasviel/ControlNet-v1-1/blob/main/control_v11p_sd15_softedge.yaml)

> 基底大模型用的是[ReV Animated](https://civitai.com/models/7371/rev-animated)

## 最终效果

![1722849030495.png](http://img.085404.xyz/images/f135e8e6170f8669016f0c1af2778412.webp)
