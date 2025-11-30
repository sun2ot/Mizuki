---
title: Aria2 部署
published: 2023-05-13
description: Windows 环境下如何部署 aria2 下载引擎
category: 教程
tags: [windows, software]
# updated: 2024-08-02 20:22:39
# categories: [教程, 搞机]
---

# Aria2 部署

## Windows

### 懒人包下载

懒人包下载：[Aria2中文网 (baisheng999.com)](http://aria2.baisheng999.com/)

>[!tip]
>下面是手动部署方案。懒人包不用部署，双击就行了

### 手动部署

下载 aria2 并解压
[Releases · aria2/aria2 (github.com)](https://github.com/aria2/aria2/releases)

![image.png](https://img.085404.xyz/images/ca9dd07621ac46710c8c2b36f7cb340b.png)

解压出来后，里面的 `aria2c.exe` 是无法直接运行的（双击直接闪退），需要添加几个文件

- `aria2.session` ——会话存储文件，直接生成空文件即可
- `aria2.conf` ——核心文件（见下文）
- `aria2.vbs` ——启动脚本（见下文）

```ini
## '#'开头为注释内容, 选项都有相应的注释说明, 根据需要修改 ##
## 被注释的选项填写的是默认值, 建议在需要修改时再取消注释  ##

## 文件保存相关 ##

# 文件的保存路径(可使用绝对路径或相对路径), 默认: 当前启动位置
dir=D:\Download
# 启用磁盘缓存, 0为禁用缓存, 需1.16以上版本, 默认:16M
disk-cache=32M
# 文件预分配方式, 能有效降低磁盘碎片, 默认:prealloc
# 预分配所需时间: none < falloc ? trunc < prealloc
# falloc和trunc则需要文件系统和内核支持
# NTFS建议使用falloc, EXT3/4建议trunc, MAC 下需要注释此项
file-allocation=falloc
# 断点续传
continue=true

## 下载连接相关 ##

# 最大同时下载任务数, 运行时可修改, 默认:5
max-concurrent-downloads=5
# 同一服务器连接数, 添加时可指定, 最大:16
max-connection-per-server=16
# 最小文件分片大小, 添加时可指定, 取值范围1M -1024M, 默认:20M
# 假定size=10M, 文件为20MiB 则使用两个来源下载; 文件为15MiB 则使用一个来源下载
#min-split-size=10M
# 单个任务最大线程数, 添加时可指定, 默认:5
split=32
# 整体下载速度限制, 运行时可修改, 默认:0
#max-overall-download-limit=0
# 单个任务下载速度限制, 默认:0
#max-download-limit=0
# 整体上传速度限制, 运行时可修改, 默认:0
#max-overall-upload-limit=0
# 单个任务上传速度限制, 默认:0
#max-upload-limit=0
# 禁用IPv6, 默认:false
disable-ipv6=true

## 进度保存相关 ##

# 从会话文件中读取下载任务
input-file=D:\software\aria2-1.36.0-win-64bit-build1\aria2.session
# 在Aria2退出时保存`错误/未完成`的下载任务到会话文件
save-session=D:\software\aria2-1.36.0-win-64bit-build1\aria2.session
# 定时保存会话, 0为退出时才保存（此处需要设置，否则失去自动保存）, 需1.16.1以上版本, 默认:0 
save-session-interval=60

## RPC相关设置 ##

# 启用RPC, 默认:false
enable-rpc=true
# 允许所有来源, 默认:false
rpc-allow-origin-all=true
# 允许非外部访问, 默认:false
rpc-listen-all=true
# 事件轮询方式, 取值:[epoll, kqueue, port, poll, select], 不同系统默认值不同
#event-poll=select
# RPC监听端口, 端口被占用时可以修改, 默认:6800
#rpc-listen-port=6800

## BT/PT下载相关 ##

# 当下载的是一个种子(以.torrent结尾)时, 自动开始BT任务, 默认:true
#follow-torrent=true
# BT监听端口, 当端口被屏蔽时使用, 默认:6881-6999
listen-port=51413
# 单个种子最大连接数, 默认:55
#bt-max-peers=55
# 打开DHT功能, PT需要禁用, 默认:true
#enable-dht=false
# 打开IPv6 DHT功能, PT需要禁用
#enable-dht6=false
# DHT网络监听端口, 默认:6881-6999
#dht-listen-port=6881-6999
# 本地节点查找, PT需要禁用, 默认:false
#bt-enable-lpd=false
# 种子交换, PT需要禁用, 默认:true
#enable-peer-exchange=false
# 每个种子限速, 对少种的PT很有用, 默认:50K
#bt-request-peer-speed-limit=50K
# 客户端伪装, PT需要
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# 当种子的分享率达到这个数时, 自动停止做种, 0为一直做种, 默认:1.0
#seed-ratio=0
# 强制保存会话, 即使任务已经完成, 默认:false
# 较新的版本开启后会在任务完成后依然保留.aria2文件
#force-save=true
# BT校验相关, 默认:true
#bt-hash-check-seed=true
# 继续之前的BT任务时, 无需再次校验, 默认:false
bt-seed-unverified=true
# 保存磁力链接元数据为种子文件(.torrent文件), 默认:false
bt-save-metadata=true

# bt-tracker 更新，解决Aria2 BT下载速度慢没速度的问题
# https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt
bt-tracker=udp://tracker.opentrackr.org:1337/announce,udp://tracker.coppersurfer.tk:6969/announce,udp://9.rarbg.to:2710/announce,udp://9.rarbg.me:2710/announce,udp://tracker.internetwarriors.net:1337/announce,udp://tracker.leechers-paradise.org:6969/announce,udp://tracker.cyberia.is:6969/announce,udp://exodus.desync.com:6969/announce,udp://explodie.org:6969/announce,http://tracker3.itzmx.com:6961/announce,http://tracker1.itzmx.com:8080/announce,udp://tracker.tiny-vps.com:6969/announce,udp://open.stealth.si:80/announce,udp://tracker.torrent.eu.org:451/announce,udp://tracker.ds.is:6969/announce,http://open.acgnxtracker.com:80/announce,udp://retracker.lanta-net.ru:2710/announce,udp://tracker.moeking.me:6969/announce,udp://ipv4.tracker.harry.lu:80/announce,udp://zephir.monocul.us:6969/announce
```

```vb
# 此处aria2的路径根据实际情况填写
# 该文件的目的是在Windows隐藏后台运行aria2
CreateObject("WScript.Shell").Run "D:\App\Aria2\aria2c.exe --conf-path=aria2.conf”,0
```

上述三个文件成功生成后，双击 `aria2.vbs` ，即可顺利启动 `aria2c.exe`

![image.png](https://img.085404.xyz/images/5367cf89c218f74eded392aa42b9e844.png)

### 设置开启自启

`win + R` ，执行以下指令，打开开启自启文件夹

```shell
shell:Common Startup
```

将 `aria2.vbs` 的快捷方式放入文件夹即可实现开机自启动

---

`2024-01-30` 更新：
可以使用 `nssm` 将 aria2c.exe 注册为系统服务，然后设置开机启动即可，进而通过 powershell 的 `start/stop-service aria2c` 来控制。

## Linux

### 安装

```bash
apt update

apt-get install aria2

#检查aria2c是否正确安装
aria2c -v
```

### 配置文件

在 `/root` 路径下（或者别的也行）创建所需的三个文件

```bash
cd ~
mkdir aria2
cd aria2

touch aria2.session
touch aria2.conf
touch aria2.log
```

在 `aria2.conf` 中写入 [该配置](https://gist.github.com/sun2ot/924f0ba492274e9ba1ff27ccd1217ae3)

> [!warning] 
> 注意修改第 2 行的密码

### 启动

```bash
# -D表示终端关闭也运行
aria2c --conf-path=/root/aria2/aria2.conf -D
```

![image.png](https://img.085404.xyz/images/cc4ce107ec60cf58f87da552498f1af1.webp)

填好了滚轮滚到最下面，点 `激活`

> 如果要使用 https，自行配置 NGINX 或类似服务

## 使用 CLI

Aria2 除了可以作为 Server 部署，也可以直接使用其 CLI `aria2c`，这里以 Linux 环境为例。因为其支持断点续传和多线程下载，因此非常适合下载大文件，可以作为 `curl/wget` 等工具的平替。

> Windows 端较少使用，但参数都类似。

### 基本用法

```bash
# 下载单个文件
aria2c http://example.com/file.zip

# 多线程下载 (16线程)
aria2c -x 16 http://example.com/file.zip

# 断点续传
# 1. 会自动生成一个 .aria2 文件来记录下载进度
# 2. 如果下载过程中断，可以使用相同的命令继续下载
aria2c -c http://example.com/file.zip

# 保存文件名
aria2c -o newname.zip http://example.com/file.zip
```

### 设置代理

```bash
# http(s) 代理
aria2c --http-proxy="http://proxy.example.com:8080" --https-proxy="https://proxy.example.com:8080" http://example.com/file.zip

# socks 代理
aria2c --all-proxy="socks5://[username:password@]proxy.example.com:1080" http://example.com/file.zip

# 某些 URL 不使用代理
aria2c --all-proxy="http://proxy.example.com:8080" --no-proxy="example.com,http://specific-site.com" http://example.com/file.zip
```