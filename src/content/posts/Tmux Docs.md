---
title: Tmux Docs
published: 2024-03-30
category: 教程
tags: [shell, powershell, linux, ssh]
# updated: 2024-06-02 12:28:12
# categories: [教程, 软件工程]
---

# Tmux Docs

## Tmux 是什么？

命令行的典型使用方式是，打开一个终端窗口（terminal window，以下简称 " 窗口 "），在里面输入命令。**用户与计算机的这种临时的交互，称为一次 " 会话 "（session）** 。

会话的一个重要特点是，窗口与其中启动的进程是连在一起的：

- 打开窗口，会话开始；
- 关闭窗口，会话结束，会话内部的进程也会随之终止，不管有没有运行完。

一个典型的例子就是，SSH 登录远程计算机，打开一个远程窗口执行命令。这时，网络突然断线，再次登录的时候，是找不回上一次执行的命令的。因为上一次 SSH 会话已经终止了，里面的进程也随之消失了。

为了解决这个问题，会话与窗口可以 " 解绑 "：窗口关闭时，会话并不终止，而是继续运行，等到以后需要的时候，再让会话 " 绑定 " 其他窗口。

**Tmux 就是会话与窗口的 " 解绑 " 工具，将它们彻底分离。**

Tmux 的标准定义是：

```
一个在 Unix 和类 Unix 系统上运行的终端复用器（terminal multiplexer）。它允许用户在单个终端窗口中同时访问多个终端会话。使用 Tmux，您可以创建、管理和控制多个终端会话，这些会话可以在后台运行，即使您断开了与服务器的连接也可以保持运行。这使得在服务器上同时运行多个终端会话变得更加高效和方便。
```

## Tmux 基本组件概念

Tmux 的核心组件分为三个：

- 会话 session
- 窗口 window
- 窗格 pane

![image.png](https://img.085404.xyz/images/705e3594e044f430e9802ea22e3ad20c.webp)

下图是一个布局示意图

![image.png](https://img.085404.xyz/images/f4267dcf8a41e09829e248afb9965684.webp)

通常来说，一个用户只需要创建一个 session 即可。不同的任务可以在不同的 window 下完成。每个 window 可以按需要划分为若干个 pane 来辅助完成任务。

## 部署 Tmux

最简单的当然是 `apt install tmux`，不过这样安装的版本并不是最新版（但是完全不影响使用）。我个人喜欢手动编译，反正要不了多久。

首先准备编译环境：

```bash
sudo apt update
sudo apt install libevent-dev ncurses-dev build-essential bison pkg-config automake
```

[Tmux wiki](https://github.com/tmux/tmux/wiki/Installing) 中没有提到 `automake`，但不排除有的机器，例如容器环境，没有该工具，所以多装一个保险。

然后编译构建：

```bash
git clone https://github.com/tmux/tmux.git
cd tmux
sh autogen.sh
./configure && make
```

> 这里是 git clone 的源码，而不是 release 发布的 `tmux-xx.tar.gz`，否则找不到 `autogen.sh`

## 如何使用 Tmux

### 关于快捷键

Tmux 有大量的快捷键。所有快捷键都要通过**前缀键**唤起。默认的前缀键是 `Ctrl + b`，即先按下 `Ctrl + b`，快捷键才会生效。

举例来说，帮助命令的快捷键是 `Ctrl + b + ?`。它的用法是，在 Tmux 窗口中，先按下 `Ctrl+b`，再按下 `?`，就会显示帮助信息。

然后，按下 `ESC` 键或 `q` 键，就可以退出帮助。

> 由于快捷键的数量太多，全部记住未必就真的“快捷”，个人认为部分指令的缩写也足够简洁明了（除非英语不太行），所以下文只会提到常用的快捷键。

一些 Reference：

- https://gist.github.com/ryerh/14b7c24dfd623ef8edc7

### 会话

#### 创建会话

```bash
# 创建一个名为 wym 会话
tmux new -s wym
```

执行后，会自动进入 wym session，并在终端下方进行亮绿色显示 `[wym]`。

在这个 session 中执行的命令，产生的任何输出都不会随着 ssh 连接的断开而丢失，即直接关闭终端程序或者网络突然断开，都不会影响当前的会话。

#### 连接会话

当我们登录服务器并需要重新连接到之前的会话时，可以通过如下方式：

```bash
# 查看当前正在运行的会话
tmux ls
# -----输出如下-----
wym: 1 windows (created Mon Apr  1 12:29:03 2024)
yzh: 1 windows (created Fri Mar 29 09:52:33 2024)
```

可以看见，当前有两个 tmux 会话，一个叫 `wym`，一个叫 `yzh`。我们需要重新连接到 `wym` 以继续之前的工作，执行：

```bash
# tmux attach (附上) -t (target, 目标) session_name
tmux attach -t wym

# 也可以将 attach 简写为 at
tmux at -t wym
```

- 如果退出会话前，有进程正在输出，则你会看到输出仍在进行或者已停止
- 之前执行的指令记录仍然存在

#### 退出会话

> 其实“退出”叫做“分离/卸载”更合适，因为关键字是 `detach`

退出会话有两种方式：快捷键和指令

```bash
# 指令
tmux detach

# 快捷键
ctrl + b + d
```

综上，一般的工作流程是：创建会话摸摸鱼，然后退出会话恰个饭，接着连接会话继续摸。。。

#### 杀死会话

除非你确定这个 session 已经没用了，否则不要轻易这么做。

```bash
tmux kill-session -t <session-name>
```

### 窗口

多个不同的任务，可以分别在不同的窗口内执行。例如 Window1 用来跑模型，Window2 用来看日志。

#### 创建窗口

输入 `tmux new` 后按 `Tab`，就可以得到相应的提示信息。

```bash
# 指令(可以指定窗口的名称)
tmux new-windows -n <window-name>

# 快捷键
ctrl + b + c  # c = create
```

快捷键创建的窗口会使用当前的 `shell` 作为名称，例如 `bash`，`zsh` 等，无法自定义名称。

#### 切换窗口

```bash
# 查看当前开启的窗口
tmux lsw  # lsw = list window
# -----输出如下-----
0: zsh (1 panes) [120x29] [layout cafd,120x29,0,0,0] @0
1: 2- (1 panes) [120x29] [layout cb00,120x29,0,0,3] @3
2: zsh* (1 panes) [120x29] [layout cb02,120x29,0,0,5] @4 (active)
```

可以看见终端下方的高亮提示条内，其实是有相关辅助信息的，例如：

```
[wym]   0:zsh   1:zsh-   2:zsh*
```

其中，`[wym]` 是当前的 session 名称，0,1,2 是三个 window 的编号。`*` 表示当前所处的时候 2 号 window，这和 `tmux lsw` 输出中的 `active` 所在行是对应的。`-` 表示上一个 window。

如果要切换窗口，也有两种方式：

```bash
# 指令：切换到0
tmux select-window -t <target-window>  # tmux select-window -t 0

# 快捷键
ctrl + b + n  # n = next，下一个窗口
ctrl + b + p  # p = previous，上一个窗口
ctrl + b + w # w = window，可以在列表中选择要切换的窗口（推荐）
```

#### 杀死窗口

> 杀死的命令其实都差不多的，可以 `tmux kill` 然后按 `Tab` 提示。

```bash
# 指令
tmux kill-window -t <target-window>

# 快捷键
ctrl + b + &  # 杀死当前窗口，会问你 yes or no
```

### 窗格

#### 创建窗格

窗格其实就是把一个窗口（window）分割为多个小块，每个块就是一个 pane。

> 屏幕够大的话，非常 nice👍

那么怎么分割呢？很显然，水平方向可以分成左右两块，垂直方向可以分成上下两块。如果要分多块，就是在每个 pane 里继续上下左右分割，行成不规则形状。

```bash
# 水平分割
tmux split-window -h  # h = horizontally

# 垂直分割
tmux split-window -v  # v = vertically
```

例如先后执行上面两句指令的话，你会得到这样一个布局：

![image.png](https://img.085404.xyz/images/74df984629aef1f04f45bcbf1c97aca3.webp)

#### 切换窗格

显然，屏幕上有这么多块，需要来回切换。这里有若干种方式：

1. 参见文末的**开启鼠标控制**一节。开启后，就可以进行符合直觉的鼠标点击切换了。
2. 指令
3. 快捷键

下面针对 2,3 两点进行介绍。

指令切换

```bash
# 查看当前 pane
tmux lsp  # lsp = list pane

# 类似于上面的 select-window, pane 也可以 select
tmux select-pane -t <target-pane>
```

快捷键

```
ctrl + b + %  垂直分割
ctrl + b +  "  水平分割
ctrl + b + q 显示每个窗格是第几个，当数字出现的时候按数字几就选中第几个窗格
```

#### 杀死窗格

```bash
# 指令
tmux kill-pane -t <target-pane>

# 快捷键
ctrl + b + x  关闭窗格
```

## 配置 Tmux
### 开启鼠标控制

```bash
# 创建Tmux配置文件
vim ~/.tmux.conf

# 添加以下内容开启鼠标控制
set -g mouse on

# 重载Tmux配置
tmux source-file ~/.tmux.conf
```

即时生效，无需重启 Tmux

### 中文显示异常

当 Tmux 的中文显示异常时（例如全部变为了下划线 `_`），可以尝试如下方式：

```bash
vim ~/.bashrc # 或者 vim ~/.zshrc
# 添加如下内容
export LANG=en_US.UTF-8 
# 生效环境变量
source ~/.bashrc # 或者 source ~/.zshrc
```

> 这个选项 `.zshrc` 默认就有，只不过被注释掉了

也可以采用 `-u` 参数强制 Tmux 使用 utf8：

```bash
# 使用 tmux 时添加 -u 参数
tmux -u new -s xxx
```

或者干脆使用 alias：

```bash
alias tmux='tmux -u'
```