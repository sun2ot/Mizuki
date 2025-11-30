---
title: WSL Docs
published: 2024-06-21
category: 教程
tags: [windows, linux]
# updated: 2024-06-21 15:13:20
# categories: [教程, 软件工程]
---

# WSL Docs

## 安装

Windows 11 内置了 `wsl.exe`，可以在 shell 中直接调用

```powershell
# 查看帮助信息
wsl --help

# 查看当前有效的分发列表
wsl --list --online
```

针对当前 2024 年 6 月，建议还是安装 `Ubuntu-20.04`，22 版本兼容性还是略差。

```powershell
 wsl --install -d Ubuntu-20.04
```

等待进度条走完后，重启电脑即可。

> 无需在控制面板中的通过 `程序与功能` 启用子系统。

## 基本操作

[wsl basic commands](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands)

```powershell
# 关机
wsl --shutdown

# 查看版本
wsl --version
```

## wslconfig

[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#wslconfig)

默认情况下，通过 `wsl` 安装的是 WSL2，WSL（或者说 WSL1 已经停止维护）。`.wslconfig` 即为 WSL2 使用的配置文件。

`.wslconfig` 默认情况下不存在，需手动在 `C:\Users\<UserName>` 下新建一个。

> [!warning] 
> 修改配置后，必须关闭 wsl 然后重启才能生效

### 主要配置项

[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#main-wsl-settings)

## WSL 网络

### NAT（默认）

默认情况下，WSL 使用基于 NAT（网络地址转换）的网络体系结构。按照 [官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/networking) 的描述，从 Windows 访问 WSL 应用，居然是访问 `localhost`？？这太他妈迷惑了。

而从 WSL 访问 Windows，按照 WSL 的网络结构，显然可以通过 Windows 的 IP 地址访问，但也可以通过 `ip route show | grep -i default | awk '{ print $3}'` 获取的 IP 进行访问，而且这个 IP 和 Windows 真正的局域网 IP 并不一致。

> 由于不太了解 NAT 具体的底层原理，姑且当做其特性吧。

### 镜像（推荐）

Windows 22H2 以后支持一种更加优雅的网络解决方案：“[镜像网络](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking)”。启用此功能会将 WSL 更改为全新的网络体系结构，其目标是将 Windows 上的网络接口“镜像”到 wsl 中，以添加新的网络功能并提高兼容性。

开启该模式需要在 `.wslconfig` 中配置：

```toml
[wsl2]
networkingMode = mirrored
```

然后使用管理员权限在 PowerShell 窗口中运行以下命令，以 [配置 Hyper-V 防火墙](https://learn.microsoft.com/zh-cn/windows/security/operating-system-security/network-security/windows-firewall/hyper-v-firewall) 设置，从而允许入站连接：

```powershell
Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
```

**或者**

```powershell
New-NetFirewallHyperVRule -Name "MyWebServer" -DisplayName "My Web Server" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -LocalPorts 80
```

## FAQ

### 代理

使用 WSL2 时，可能会遇到报错：

```
wsl: 检测到 localhost 代理配置，但未镜像到 WSL。NAT 模式下的 WSL 不支持 localhost 代理。
```

在 WSL1 时代，由于 Linux 子系统和 Windows 共享了网络端口，所以访问 Windows 的代理非常简单。例如 Windows 的代理客户端监听了 8000 端口，那么只需要在 Linux 子系统中执行如下命令，就可以让当前 session 中的请求通过代理访问互联网。

```bash
export ALL_PROXY="http://127.0.0.1:8000"
```

但是 WSL2 基于 Hyper-V 运行，导致 Linux 子系统和 Windows **在网络上是两台各自独立的计算机**，从 Linux 子系统访问 Windows 首先需要找到 Windows 的 IP。

所以解决该问题，可以在 `.wslconfig` 中关闭自动代理。注意，按照微软 [官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#main-wsl-settings) 的最新版，`autoProxy` 已经不再属于实验性设置 `[experimental]`，而是属于主要设置 `[wsl2]`：

```
[wsl2]
# 在该节下新增配置
autoProxy = false
```

> 当然，你也可以按照 [issue](https://github.com/microsoft/WSL/issues/10753#issuecomment-1814839310) 让自动代理正常工作，而不是关闭。

### nvidia 驱动与 cuda 问题

如果 windows 主系统中已安装了 nvidia 驱动，ubuntu 中不要再额外安装了，可以直接通过 `nvidia-smi` 查看。

