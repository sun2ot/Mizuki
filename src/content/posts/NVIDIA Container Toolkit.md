---
title: NVIDIA Container Toolkit
published: 2024-09-11
category: 教程
# updated: 2024-09-13 09:53:15
# categories: [教程, 软件工程]
---

## 问题描述

在早期深度学习尚未普及时，Docker 作为一种容器技术是不支持调用宿主机 GPU 的，后面在 Docker 官方以及 NVIDIA 的推动下才得以支持，这其中的关键就在于 NVIDIA Container Toolkit。

通常有两种情况可能会需要 NVIDIA Container Toolkit：
1. 主动：需要 Docker 容器调用 GPU
2. 被动：遇到报错 `# docker: Error response from daemon: could not select device driver ““ with capabilities: [[gpu]].`

## 安装

[官方文档](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

首先，需要装好 [ NVIDIA 显卡驱动](https://www.nvidia.com/en-us/drivers/)。然后配置仓库：

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

> 上述指令切记分两条分别执行，否则会出现看似添加了源但其实没有添加上的尴尬情况。

完成后，更新并安装 NVIDIA Container Toolkit 软件包：

```bash
sudo apt update
sudp install -y nvidia-container-toolkit
```

安装完成后，记得重启 Docker：

```bash
sudo systemctl restart docker
```