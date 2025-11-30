---
title: nvidia-smi
published: 2024-05-17
category: 教程
tags: [gpu, 云计算, 服务器, linux, cli]
# updated: 2024-05-17 18:42:23
# categories: [教程, 软件工程]
---

# nvidia-smi

## 介绍与使用

nvidia-smi，全称为 NVIDIA System Management Interface，是一个跨平台的命令行工具，**用于监控和管理 NVIDIA GPU 的状态和性能**。它可以显示 GPU 的详细信息，包括型号、驱动版本、内存使用情况、温度、功耗等。此外，它还可以用于控制 GPU 的行为，如调整频率、设置风扇转速等。

在日常的 DL 过程中，应首先关注 GPU 资源的使用情况，否则当资源不足时可能出现 `cuda out of memory` 等错误。

`nvidia-smi` 的使用方式就是其本身：

```bash
nvidia-smi
```

显示信息如下：

```
Fri May 17 16:16:12 2024       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.129.06   Driver Version: 470.129.06   CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA TITAN V      Off  | 00000000:2D:00.0  On |                  N/A |
| 28%   43C    P8    30W / 250W |     16MiB / 12058MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  NVIDIA TITAN V      Off  | 00000000:99:00.0 Off |                  N/A |
| 28%   42C    P8    24W / 250W |      5MiB / 12066MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      2367      G   /usr/lib/xorg/Xorg                 14MiB |
|    1   N/A  N/A      2367      G   /usr/lib/xorg/Xorg                  4MiB |
+-----------------------------------------------------------------------------+
```

从上至下分为两个表格，先看**下面的表格**，主要显示占用 GPU 资源的进程信息，从左到右分别为：

- `GPU`：GPU 编号，与数组下标类似，从 0 开始
- `GI ID`： GPU 实例 ID（用于 MIG 模式），在非 MIG 模式下为 `N/A`
- `CI ID`：计算实例 ID（用于 MIG 模式），在非 MIG 模式下为 `N/A`
- `PID`：进程 ID
- `Type`：进程类型
	- `G`：表示图形进程
	- `C`：表示计算进程
- `Process name`：进程的名称和路径
- `GPU Memory Usage`：进程占用 GPU 的内存量

> [!note] 总结
> 通常情况下，根据 Processes 表中的信息，即可判断出：谁的哪个进程占用了某张卡的多少资源。还可以在~~拳头够大~~友好交流的前提下，根据 PID 杀死该进程。

---

再来**看上面的表格**，首先是第一行：

- `NVIDIA-SMI`：工具版本
- `Driver Version`：驱动版本
- `CUDA Version`：Driver API 对应的 CUDA 版本（这是一个略复杂的问题，有空再写）

**第二行是表头**，的每个格子内分为若干行，每行有若干字段。这个表格的正确读取方式为：**每个单词都代表一个独立值**。例如第二行第一个格子内实际上有 7 个值，分别为：

- `GPU`：GPU 编号
- `Name`：GPU 名称
- `Persistence-M`：是否开启持久模式
- `Fan`：GPU 风扇的当前速度百分比
- `Temp`：GPU 的当前温度（摄氏度）
- `Perf`：当前的性能状态
	- `P8`：表示**最低**功耗状态
	- `P0`：表示**最高**性能状态
- `Pwr:Usage/Cap`：当前功耗和最大功耗（瓦特）

第二行第二列：

- `Bus-Id`：GPU 在 PCIe 总线上的标识符
- `Disp.A`：显示设备是否正在使用 GPU（`on/off`）
- `Memory-Usage`：GPU 内存使用情况

第二行第三列：

- `Volatile Uncorr. ECC`：易失性不可纠正错误计数
- `GPU-Util`：GPU 利用率百分比
- `Compute M.`：计算模式
	- `Default`：默认计算模式
	- `Exclusive Thread`：每个 GPU 只能被一个线程访问
	- `Prohibited`：禁止使用 CUDA
- `MIG M.`：多实例 GPU（MIG）模式

## Memory-Usage 与 GPU-Util

以上表为例，不难发现 `Memory-Usage` 存在 GPU 内存占用时，`GPU-Util` 百分比为 0。

因为当前 GPU 并没有进行计算任务（如深度学习训练或推理），但仍然有内存被分配和占用。

## 👻幽灵占用

“幽灵占用”问题与上一节类似，主要体现在 `Memory-Usage` 大量占用，但不仅 `GPU-Util` 百分比为 0，而且 Processes 表中没有进程或进程占用量与上面显示的不符。

> [!tip] 
> “幽灵占用”这名字是我随口起的，不确定这个问题的学名叫什么。。。

这种情况多是由于用户运行了一些自己都不知道是什么玩意的代码，自然也就不知道产生的进程究竟有没有结束，见下图：

![Linus-garbage-code.webp](https://img.085404.xyz/images/0b6471356cb82e36c38d27ec6ce45711.webp)

针对此类问题，可以尝试以下几步：

```bash
# 先查看哪些进程在使用 GPU 设备文件
sudo fuser -v /dev/nvidia*
```

如果能找到可疑进程，直接根据输出的 PID 杀死即可。

如果这一招也不行，那就采用一个更无脑但有效的方案：

```bash
ps aux | grep python
```

直接找 Python 相关的进程，一个个杀。