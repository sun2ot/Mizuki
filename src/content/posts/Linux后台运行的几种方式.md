---
title: Linux后台运行的几种方式
published: 2024-03-10
category: 教程
tags: [linux, env, shell]
# updated: 2024-04-23 20:57:16
# categories: [教程, 软件工程]
---

# Linux后台运行的几种方式

## 使用进程守护工具

> 这里以 node.js 的 [pm2](https://pm2.keymetrics.io/) 为例。Deep Leaners 建议跳过这一节。

### 部署

```bash
# 全局安装pm2
npm i pm2 -g  

# 进入项目目录下
pm2 start index.js  --name your-project-any-name
```

![image.png](https://img.085404.xyz/images/cc4cc59aebdce5733aab01c9f28f1813.png)

**利用该方式可以在服务器上运行多个 Node.js 项目**

### pm2 命令

| 命令                                    | 解释              |
| ------------------------------------- | --------------- |
| `pm2 start index.js --name my-server` | 启动并命名进程         |
| `pm2 list`                            | 显示所有进行          |
| `pm2 stop my-server`                  | 停止 my-server 这个进程 |
| `pm2 restart all`                     | 启动所有进程          |
| `pm2 delete my-server`                | 删除某个进程          |
| `pm2 show my-server`                  | 查看某个进程的详情信息     |
| `pm2 logs`                            | 查看日志信息          |
| `pm2 start <programe> -- <command>`   | 守护可执行程序         |

## nohup

### 什么是 nohup

在 Unix 和类 Unix 操作系统中，信号是进程间通信的一种方式，用于通知接收进程某个事件已经发生。挂起信号（SIGHUP）是其中的一种。

当终端或控制进程断开时，操作系统会向由该终端启动的进程发送 SIGHUP 信号。默认情况下，大多数进程在接收到 SIGHUP 信号时会终止。这是因为，在早期 Unix 系统中，终端断开通常意味着用户已经“挂断”了电话线，因此与终端相关的进程不再有用。

然而，有时希望**即使在终端断开的情况下，进程也能继续运行**。这就是 `nohup` 命令的用途。`nohup` 命令会忽略 SIGHUP 信号，使得启动的进程在终端断开后继续运行。此外，`nohup` 还会自动将进程的标准输出和标准错误输出重定向到 `nohup.out` 文件，以防止输出丢失。

### 使用方式

这里给出三种指令模板，按需使用：

```bash
# 忽略挂起信号, 错误输出和标准输出都被重定向到 `nohup.out`
nohup python your_script.py > output.log 2>&1 &

# 忽略挂起信号, 标准输出都被重定向到 `nohup.out`
nohup python your_script.py > output.log &

# 忽略挂起信号, 但没有指定输出重定向
nohup python your_script.py &
```

这里的 `output.log` 可以是任意文本文件，例如 `a.txt`，`b`，`log.aaa` 等，随你喜欢。所以显然，第二种和第三种除了指定输出文件名的区别外，没有其他差异。

有时即使使用了 `nohup` 和 `&` 让命令在后台运行，退出 SSH 连接时仍然可能会收到 `"you have running jobs"` 的提示（实测会发生在 `zsh` 中）。这是因为退出 shell 会话时，shell 会检测到仍然有在当前 shell 会话中启动的进程（即使它们是后台进程）。

要避免这个问题，可以使用 `disown` 命令来从当前 shell 的作业列表中删除这些作业，使它们不受当前 shell 会话的影响。例如：

```bash
# 执行了某个作业
nohup ./frps -c frps.toml &

# 删除作业记录
disown
```

这并不影响后台作业的执行。当然，也可以直接关闭 shell 窗口以退出用户登陆。

## Tmux

[Tmux Docs](https://blog.085404.xyz/method/tmux-docs.html)

