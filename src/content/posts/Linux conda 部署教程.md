---
title: Linux conda 部署教程
published: 2023-09-14
category: 教程
tags: [linux, env, python]
# updated: 2023-09-14 19:22:38
# categories: [教程, 软件工程]
---

## 部署 conda

登录用户，然后逐行输入下列指令

```bash
# 建立 miniconda3 文件夹
mkdir -p ~/miniconda3
# 下载安装脚本
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
# 执行脚本并安装 conda 到 ~/miniconda3 路径下
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
# 删除脚本(可删可不删，无所谓)
rm -rf ~/miniconda3/miniconda.sh
# 初始化 bash
~/miniconda3/bin/conda init bash
# 生效环境变量
source ~/.bashrc
```

## 自动生效环境变量

> 完成上述操作后，输入 `exit` 关闭 ssh 连接，然后重新登录。如果发现刚刚的配置又失效了，例如 `conda` 指令又识别不出来了，再执行下列操作，否则直接跳过。

环境失效是因为 `~/.bashrc` 中的内容没有随着登录自动执行

所以我们需要做出如下修改，使刚刚的配置随着我们登录自动生效

```bash
# 进入用户路径
cd ~
# 创建 .bash_profile 文件
touch .bash_profile
# 修改该文件
vim .bash_profile
```

插入以下内容

> 按 `i` 进入编辑模式， `ESC` 退出编辑模式， `:wq` 保存并退出

```bash
# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi
```

然后输入 `exit` 关闭连接，然后重新 ssh 登录，即可发现 `~/.bashrc` 的配置自动生效。

