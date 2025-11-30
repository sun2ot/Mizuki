---
title: frp内网穿透alist
published: 2024-02-25
category: 教程
tags: [software, windows, linux]
# updated: 2024-02-25 20:55:23
# categories: [教程, 搞机]
---

## 相关资源

[frp GitHub](https://github.com/fatedier/frp)

[frp 中文文档](https://gofrp.org/zh-cn/)

## 事件背景

公元 2024 年，傻逼校园网屏蔽了内网不同网段设备的访问，导致我的所有局域网解决方案全部失效（例如 alist）。至此，我无法躺在宿舍的床上看实验室里电脑的视频，这极大的影响了我的科研热情。为此，决定进行内网穿透。

**本次进行的内网穿透主要针对 http 服务（alist）。**

## 服务端配置

> 下述内容也可以参考官方示例 [vhost-http](https://gofrp.org/zh-cn/docs/examples/vhost-http/)

```bash
# 下载 frp
wget https://github.com/fatedier/frp/releases/download/v0.54.0/frp_0.54.0_linux_amd64.tar.gz
# 解压
tar -zxvf frp_0.54.0_linux_amd64.tar.gz
```

注意，frp 的 Github Release 内包括客户端与服务端两部分，分别对应 `frps*` 于 `frpc*`。所以服务端配置可以删除 `frpc*`。

> 此外，麻烦还在无脑搬运的看看这个："从 v0.52.0 版本开始，frp 开始支持 TOML、YAML 和 JSON 作为配置文件格式。请注意，**INI 已被弃用，并将在未来的发布中移除**。新功能**只能**在 TOML、YAML 或 JSON 中使用。希望使用这些新功能的用户应相应地切换其配置格式。"—— [frps docs](https://gofrp.org/zh-cn/docs/features/common/configure/)

服务端 `frps.toml` 内容如下：

```toml
bindPort = 7000 # frp 服务端口
vhostHTTPPort = 5245 # 监听 HTTP 的端口
```

请确保关闭这两个端口的防火墙。

## 客户端配置

```toml
serverAddr = "172.16.16.242" # 服务端 IP
serverPort = 7000 # 服务端 frp 服务端口

[[proxies]] # 可写可不写，不影响
name = "alist" # 需唯一
type = "http"
localPort = 5244  # 本地 http 服务的端口
customDomains = ["your_domain.com"]
```

针对该配置文件做出补充介绍：
1. 不难发现我这里的 `serverAddr` 并不是一个公网 IP，而是一个内网 IP。因为校园网屏蔽了外网 IP，导致我的新加坡服务器无法作为内网穿透的服务端，因此退而求其次使用了一台内网服务器作为服务端。因此严格来说，本次实践是进行的**内网的内网穿透**。
2. `customDomains` 是一个 A 记录解析到 `serverAddr` 的域名。参考官方文档，DomainConfig 有 ` customDomains ` 和 ` subdomain ` 两个配置项。实测必须指定一个，否则会报错 `proxy xxx: subdomain and custom domains should not be both empty`

## 启动 frp 服务

**启动服务端**：

```bash
./frps -c frps.toml
```

服务端成功启动后，会看到如下类似信息：

```
2024/02/25 19:41:14 [I] [root.go:105] frps uses config file: frps.toml
2024/02/25 19:41:15 [I] [service.go:225] frps tcp listen on 0.0.0.0:7000
2024/02/25 19:41:15 [I] [service.go:292] http service listen on 0.0.0.0:5245
2024/02/25 19:41:15 [I] [root.go:114] frps started successfully
```

**启动客户端**：

```powershell
.\frpc.exe -c .\frpc.toml
```

客户端启动成功后，会看到如下类似信息：

```
2024/02/25 19:42:52 [I] [root.go:142] start frpc service for config file [.\frpc.toml]
2024/02/25 19:42:52 [I] [service.go:287] try to connect to server...
2024/02/25 19:42:52 [I] [service.go:279] [7e047f197c32f772] login to server success, get run id [7e047f197c32f772]
2024/02/25 19:42:52 [I] [proxy_manager.go:173] [7e047f197c32f772] proxy added: [alist]
2024/02/25 19:42:52 [I] [control.go:170] [7e047f197c32f772] [alist] start proxy success
```

此时服务端也会同步显示客户端连接情况：

```
2024/02/25 19:42:54 [I] [service.go:563] [7e047f197c32f772] client login info: ip [172.26.109.89:1557] version [0.54.0] hostname [] os [windows] arch [amd64]
2024/02/25 19:42:54 [I] [http.go:110] [7e047f197c32f772] [alist] http proxy listen for host [your_domain.com] location [] group [], routeByHTTPUser []
2024/02/25 19:42:54 [I] [control.go:401] [7e047f197c32f772] new proxy [alist] type [http] success
```

## 访问内网服务

通过 `http://your_domain.com:5245` 即可访问内网设备 `127.0.0.1` 下端口 `5244` 的服务。

> 客户端配置中，`localIP` 默认为 `127.0.0.1`，故省略。如有需要请自行修改。




