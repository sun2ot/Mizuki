---
title: 高级 GPU 资源监控 nvitop
published: 2024-05-17
category: 教程
tags: [gpu, 云计算, 服务器, linux, cli]
# updated: 2024-05-17 18:45:21
# categories: [教程, 软件工程]
---

# 高级 GPU 资源监控 nvitop

## 介绍

[nvitop](https://github.com/XuehaiPan/nvitop)：交互式的 NVIDIA-GPU 监控。略多版介绍可见 [上海交大超算平台用户手册-nvitop](https://docs.hpc.sjtu.edu.cn/app/compilers_and_languages/nvitop.html)。

## 部署

请务必使用 root 权限进行全局安装，否则会被安装到 conda 隔离环境中。

```bash
sudo pip3 install --upgrade nvitop
```

## 参数列表

> [!tip] 只列出的部分常用参数，具体见官方文档，或者 `nvitop --help`

```bash
可选参数:
  --help, -h            帮助文档
  --version, -V         查看版本号
  --once, -1            只显示一次信息
  --monitor [{auto,full,compact}], -m [{auto,full,compact}]
                        持续监控,如果省略-m参数,默认采用auto
  --interval SEC        进程状态更新间隔(单位: 秒) (默认: 2s)

颜色:
  --colorful            使用渐变色显示条形图
  --light               使用亮色主题显示(NVITOP_MONITOR_MODE="light")

设备过滤:
  --only idx [idx ...], -o idx [idx ...]
                        只显示指定设备
  --only-visible, -ov   只显示 `CUDA_VISIBLE_DEVICES` 环境变量对应的设备

进程过滤:
  --compute, -c         显示具有计算上下文的GPU进程 (type: 'C' or 'C+G')
  --only-compute, -C    显示只具有计算上下文的GPU进程 (type: 'C' only)
  --graphics, -g        显示具有图形处理上下文的GPU进程 (type: 'G' or 'C+G')
  --only-graphics, -G   显示只具有图形处理上下文的GPU进程 (type: 'G' only)
  --user [USERNAME [USERNAME ...]], -u [USERNAME [USERNAME ...]]
                        显示指定用户的进程 (or `$USER` for no argument).
  --pid PID [PID ...], -p PID [PID ...]
                        显示置顶PID的进程
```

## 快捷键

默认情况下，调用 `nvitop` 会进入 monitor 模式，类似于 `top`，而 `nvitop -1` 才是与原版 `nvidia-smi` 类似的单次显示。

在 monitor 模式下，存在一些快捷键：

> 太多了，只摘取了一些常用的，懒得翻译了，就这样吧

|            Key            |                                   Binding                                   |
| :-----------------------: | :-------------------------------------------------------------------------: |
|            `q`            |                      Quit and return to the terminal.                       |
|         `h` / `?`         |                           Go to the help screen.                            |
|      `a` / `f` / `c`      |           Change the display mode to _auto_ / _full_ / _compact_.           |
|  `r` / `<C-r>` / `<F5>`   |                          Force refresh the window.                          |
|     `<Up>` / `<Down>`     |                       Select and highlight a process.                       |
|   `<Left>` / `<Right>`    |                  Scroll the host information of processes.                  |
|         `<Home>`          |                          Select the first process.                          |
|          `<End>`          |                          Select the last process.                           |
|     `<C-a>`  <br>`^`      | Scroll left to the beginning of the process entry (i.e. beginning of line). |
|     `<C-e>`  <br>`$`      |      Scroll right to the end of the process entry (i.e. end of line).       |
| `<PageUp>` / `<PageDown>` |           scroll entire screen (for large amounts of processes).            |
|         `<Space>`         |                         Tag/untag current process.                          |
|          `<Esc>`          |                          Clear process selection.                           |
|     `<C-c>`  <br>`I`      |          Send `signal.SIGINT` to the selected process (interrupt).          |
|            `T`            |         Send `signal.SIGTERM` to the selected process (terminate).          |
|            `K`            |            Send `signal.SIGKILL` to the selected process (kill).            |
|            `e`            |                          Show process environment.                          |
|            `t`            |                        **Toggle tree-view screen.**                         |
|         `<Enter>`         |                            Show process metrics.                            |
|         `,` / `.`         |                           Select the sort column.                           |
|            `/`            |                           Reverse the sort order.                           |




