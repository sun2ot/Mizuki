---
title: 反向ssh隧道搭建
published: 2025-01-12
category: 教程
# updated: 2025-01-12 13:47:32
# categories: [教程, 搞机]
---

## 问题背景

存在公网服务器 A 和内网服务器 B。由于不想仅仅为了连接 B 而开启 VPN，因此采用 A 来中转到 B 的 ssh 请求。

## 操作方式

基础的 ssh 已经足够使用，但如果 A 和 B 的连接不稳定（例如 A 为海外服务器），可能导致 ssh 连接断开。所以这里采用 `autossh` 来自动维护连接。

```bash
sudo apt update
sudo apt install autossh
```

在**内网**服务器 B 上执行反向隧道开启命令并使用 `autossh` 代替 `ssh`：

```bash
autossh -f -M 0 -N -R 4410:localhost:22 -p 2222 sshp@206.237.1.69
```

参数说明如下：
- `-f`：后台运行。
- `-M 0`：禁用 `autossh` 默认的端口监控功能（推荐使用 `ServerAliveInterval`）。
- `-N`：不执行远程命令，仅用于转发。
- `-R`：定义反向隧道。
- `-p 2222`：指定公网服务器的 SSH 端口。

上述指令将公网服务器 A 的 4410 端口，映射到内网服务器的 22 端口，该映射关系通过 ssh 连接建立。其中，`sshp` 是一个公网服务器上已经存在的用户（**没有的话需创建**）。

因此，对于内网服务器 B，现在可以通过公网服务器 A 来连接：

```bash
ssh -p 4410 local_user@A_ip
```

这里的 `local_user` 是内网服务器 B 上的用户。至此，通过公网服务器 A 即可连接到内网服务器 B。