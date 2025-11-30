---
title: GitHub添加SSH密钥
published: 2024-04-08
category: 教程
tags: [git, github, ssh]
# updated: 2024-09-23 10:42:23
# categories: [教程, 软件工程]
---

## 生成密钥

```bash
 ssh-keygen -t ed25519 -C "sun2ot@qq.com" -f ~/.ssh/your-key
```

- `-t`：加密方式，rsa，ed25519，或者别的 GitHub 支持的都可以。
- `-C`：GitHub 邮箱，用于注释密钥。
- `-f`：指定生成密钥的位置和名称。建议存放在 `~/.ssh/` 下，但名称可以自定义以避免重复。无需指定密钥文件的后缀，openssh 会自动生成。

生成密钥时会提示是否需要设置 `passphrase`，这个可以置空，不影响使用。

生成完成后，会在 `~/.ssh/` 下生成 `your-key`（私钥）和 `your-key.pub`（公钥）。接下来，需要将公钥上传到 GitHub。

## 添加公钥到 GitHub

官方教程：[英文](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) [中文](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

1. 点击右上角 GitHub 头像
2. 点击 `Settings`
3. 左侧菜单列表找到 `SSH and GPG keys`
4. 点击绿色的 `New SSH key`
    1. `Title` 是用以区分的密钥别名，随意指定即可
    2. `Key Type` 保持 Authentication Key 不变
    3. `Key` 中填入刚刚生成的 `your-key.pub` 中的内容，例如
       `ssh-ed25519 123456abcd your@email.com`
    4. 点击 `Add SSH key` 即可

## 通过 SSH 进行克隆

首先测试与 GitHub 的 SSH 连通性：

```bash
ssh -T git@github.com
```

如果一切正常应该会输出如下内容：

```
Hi your-github-name! You've successfully authenticated, but GitHub does not provide shell access.
```

> 可能还有一些 Warning，或者提示写入 fingerprint 的提示，这都是正常的。

但如果报错 `kex_exchange_identification: read: Connection reset by peer`，请检查网络环境。大概率是🧱的问题，需要🪜来代理一下，见 [git 代理](https://blog.085404.xyz/metohd/github-ssh.html)。

如果生成密钥时指定了自定义名称，建议在 ssh 配置文件中写明，防止出现 `Permission denied (publickey).` 错误：

```bash
vim ~/.ssh/config

# 在其中添加
Host github.com
  Hostname ssh.github.com
  IdentityFile /path/to/your/private-key  # 自定义密钥路径
  User git
```

处理完上述问题后，便可以正常访问仓库：

```bash
git clone git@github.com:<github-name>/<repo-name>.git
```

这个克隆地址与 HTTP 类似，都可以在 GitHub 的网页复制下来。