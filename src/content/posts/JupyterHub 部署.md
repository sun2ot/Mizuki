---
title: JupyterHub 部署
published: 2024-04-15
category: 教程
tags: [Jupyter, Python, env, software]
# updated: 2024-04-15 16:03:13
# categories: [教程, 软件工程]
---

## 什么是 JupyterHub

[JupyterHub](https://github.com/jupyterhub/jupyterhub) is the best way to serve [Jupyter notebook](https://jupyter-notebook.readthedocs.io/en/latest/) for **multiple users**. Because JupyterHub manages a separate Jupyter environment for each user, it can be used in a class of students, a corporate data science group, or a scientific research group. It is a multi-user **Hub** that spawns, manages, and proxies multiple instances of the single-user [Jupyter notebook](https://jupyter-notebook.readthedocs.io/en/latest/) server.

## 前置环境

### 安装 Python 和 pip

大多数发行版 Unix 系统都自带 python 和 pip：

```bash
apt install python3 python3-pip
```

注意这里用 `pip3 -V` 看一下版本。太老的版本（例如 python 3.6）基本是会出问题的。所以如果需要更新 `pip3`：

```bash
sudo -H pip3 install -U pip
```

如果提示 `Cache entry deserialization failed, entry ignored`，可能是由于某些缓存文件损坏或不完整所致。这个问题通常可以通过清理 `pip` 的缓存来解决：

```bash
pip3 cache purge
```

如果你的 `pip3` 版本太老，也可能提示 `ERROR: unknown command "cache" - maybe you meant "check"`，那就只能手动清楚缓存了：

```
# Linux下的pip缓存通常在 `~/.cache/pip` 或 `/var/cache/pip`
rm -rf ~/.cache/pip
rm -rf /var/cache/pip
```

然后重新执行 `sudo -H pip3 install -U pip`。

### 安装 JupyterHub

```bash
sudo -H pip3 install -U jupyterhub
```

- `-H` 选项告诉 `pip` 使用 HOME 环境变量指定的目录作为家目录。这在使用 `sudo` 时很重要，因为默认情况下，`sudo` 会重置 HOME 环境变量为 `/root`。使用 `-H` 选项可以确保 `pip` 将包安装到当前用户的家目录下，而不是 root 用户的家目录下。这样做是为了避免因为权限问题导致的包安装到错误的位置。
- `-U` 选项是 `pip` 的一个标志，代表 `--upgrade`。它告诉 `pip` 安装包之前先尝试升级已安装的包到最新版本。如果已经安装了某个包，`-U` 选项会使 `pip` 尝试升级到新版本，如果没有指定包，则会安装最新版本。

### 安装 configurable-http-proxy

这是一个 nodejs 模块，npm 安装的（官方要求的）。理论上说，安装 nodejs 用 `apt install` 就行。不过版本实在太老了，所以还是建议手动 install 吧，反正也不费什么事。

```bash
npm install -g configurable-http-proxy
```

> 去官网找**契合操作系统版本**的 Node.js LTS 版本即可。

## 配置 JupyterHub

> 基于 `JupyterHub version 2.3.1`。移除网络上抄来抄去的过时配置。

[生成默认配置文件](https://jupyterhub.readthedocs.io/en/stable/tutorial/getting-started/config-basics.html#generate-a-default-config-file) 并移动到公共目录：

```bash
jupyterhub --generate-config
mkdir -p /etc/jupyterhub
mv jupyterhub_config.py /etc/jupyterhub/
```

> 可能会报错 python 版本不受支持之类的，可以忽略不用管。

接下来修改配置文件：

```python
# 使用 JupyterLab 而非 Jupyter Notebook（可选）
c.Spawner.default_url = "/lab"

c.JupyterHub.ip = "0.0.0.0"
c.JupyterHub.port = 8000

# 设置 Jupyterhub 的管理员账户
c.Authenticator.admin_users = {"yzh","hml"}
#如果未设置此配置值，则所有经过身份验证的用户都将被允许进入您的集线器。
c.Authenticator.allowed_users = {'yzh'}
```

上述过程完成后，即可启动 JupyterHub：

```bash
jupyterhub -f /etc/jupyterhub/jupyterhub_config.py
```

注意，会在启动 JupyterHub 的路径下生成 `jupyterhub.sqlite` 和 `jupyterhub_cookie_secret` 文件，如有必要可以进行定时备份。

## 切换 kernel

在 Jupyter 中，每个 kernel 对应一个运行环境。对于一个 conda 环境，只需要安装 `ipykernel`，即可被 Jupyter 识别到：

```bash
# 激活要使用的环境
conda activate jtest

# 安装 ipykernel
conda install ipykernel

# 添加到 Jupyter kernel list
## --name: conda 环境的名称
## --display-name: Jupyter 中显示的名称
python -m ipykernel install --user --name jtest --display-name "jtest"
```

重启当前用户的 Jupyter Server，即可在 kernel 菜单中发现 `jtest`。

> 其他用户登录 JupyterHub 时，无法看到该 kernel。

> [!warning] 禁止使用（污染）JupyterHub 的默认 kernel！请自行创建 conda 环境以使用。

