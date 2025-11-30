---
title: SSH 免密连接服务器
published: 2024-03-10
category: 教程
tags: [ssh, linux]
# updated: 2024-03-12 18:20:18
# categories: [教程, 软件工程]
---

## 在 Windows 端创建密钥

> [!tip] 
> Win10 已经内置了 openssh 组件，可以直接使用。其他版本自行搜索。

```shell
ssh-keygen
```

回车后会让你设置密钥生成路径以及 phrase 等内容，默认为空即可，一路回车。

然后可以在 `C:\Users\你的win用户名\.ssh` 下看到 `id_rsa` 和 `id_rsa.pub` 两个文件，其中前者为私钥，后者为公钥。

## 上传公钥

### 仅 Linux 可用

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@host
```

这里的 `user` 和 `host` 对应需要免密连接的服务器的用户和 IP 地址。

### 通用方法

通过 scp，或者 sftp，或者其他什么方式，将公钥 `id_rsa.pub` **文件的内容**粘贴到服务器的 `~/.ssh/authorized_keys` 文件中。

> [!warning] 
> 如果你想在服务器上存放多个公钥文件，请保证每个公钥在 authorized_keys 文件中单独占一行。如果使用 `ssh-copy-id` 则可以忽略此处。

## 配置本地 ssh

ssh 配置文件地址：

```
# windows
C:\Users\你的win用户名\.ssh\config

# Linux
~/.ssh/config
```

在配置文件中添加如下内容：

```yaml
Host 自定义名称
  HostName 服务器的IP/域名
  User 登录用户名
  IdentityFile C:\Users\你的win用户名\.ssh\id_rsa
```

> [!tip]
> 此处的 IdentityFile 为私钥路径，即 `id_rsa`

然后就可以在 Terminal 中实现免密 ssh 访问服务器

```shell
ssh 自定义名称
```

### 备注

也许你会发现，通过 `ssh-copy-id` 命令或者别的什么方式，将公钥添加到远程服务器的 `authorized_keys` 文件中后，即使并且没有在本地 SSH 配置文件中显式指定 `IdentityFile` 字段，但仍然可以成功进行免密连接。

这是因为 SSH 客户端会默认使用 `~/.ssh/id_rsa`（默认私钥文件）来进行身份验证。

SSH 客户端在尝试连接时会按照一定的顺序搜索可用的私钥文件，其中包括默认的 `~/.ssh/id_rsa` 文件。因此，如果你的私钥文件恰好是默认的 `~/.ssh/id_rsa`，那么在本地 SSH 配置文件中不显式指定 `IdentityFile` 字段也可以进行免密连接。

虽然在某些情况下可以省略 `IdentityFile` 字段，但为了确保连接的稳定性和安全性，建议在本地 SSH 配置文件中明确指定要使用的私钥文件路径。这样可以避免混淆和不必要的问题，并确保连接设置是清晰明了的。