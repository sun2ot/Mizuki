---
title: git 代理
published: 2024-03-10
category: 教程
tags: [git, proxy]
# updated: 2024-06-18 10:59:22
# categories: [教程, 软件工程]
---

# git 代理

```shell
# 设置
git config --global http.proxy "socks5://127.0.0.1:7890"  # clash的socks5端口是7890
git config --global https.proxy "socks5://127.0.0.1:7890" # 根据实际情况做修改
```

```shell
# 恢复
git config --global --unset http.proxy
git config --global --unset https.proxy
```

git 的配置范围有三种，一般情况下可以选择不加 `--global` 参数，实现局部（也就是当前仓库）配置，毕竟不是每一个库都需要代理吧。

```shell
# 查看当前git config
# 系统
git config --system --list
# 全局
git config --global --list
# 当前仓库
git config --local --list
```

如果是在克隆时需要临时使用代理，也可以使用命令行参数实现：

```bash
# http/https 代理
git clone --config http.proxy=http://<proxy_address>:<port> <repository_url>

# socks5 代理
git clone --config http.proxy=socks5://<proxy_address>:<port> <repository_url>
```

注意，SSH 默认不会走 Windows 下的系统代理，更不会走 Linux 的后台代理，因此，如果发现通过 SSH 进行 `git clone` 时报错，可以排查是否为网络问题。如果是，需要配置 ssh config 并指定代理。以下是 Linux 的 SSH 代理设置方式，需借助 `netcat` 实现。

```
Host github.com
  Hostname ssh.github.com
  IdentityFile /home/yzh/.ssh/whr-yzh-git
  User git
  Port 443
  ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```

Windows 的 ssh 代理设置方式，见 [Windows平台代理OpenSSH](../Shell/SSH/Windows平台代理OpenSSH.md)

