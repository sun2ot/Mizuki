---
title: Clash Core 部署
published: 2024-02-25
category: 教程
tags: [GFW, linux, clash]
# updated: 2024-02-25 21:53:14
# categories: [教程, 搞机]
---

## 写在前面

理论上说，学校是可以给教职工服务器开通外网访问权限的。。。咱不敢问，也不敢说，所以还是自己动手丰衣足食吧，反正对于法外狂徒来说，代理只是家常便饭了。

clash dashboard 面板密码：`yzh112358`

代理程序的二进制文件位于服务器的 `/usr/local/bin/mihomo`。

配置文件位于 `/etc/mihomo`，结构如下：

```
mihomo/
├── cache.db  缓存
├── config.yaml  配置文件
├── Country.mmdb  geoip数据库
├── providers/  规则集
└── ui/  web面板
```

## 你需要知道

1. [什么是代理？和 VPN 有什么区别？](https://www.kaspersky.com.cn/resource-center/preemptive-safety/vpn-vs-proxy-server)
2. [什么是“机场”？](https://www.vpn-china.org/the-difference-between-airport-and-vpn/)


> 为了避免上述链接失效或无法直连访问，已将对应页面归档为 `.WACZ`。打开该文件，可以通过 `Webrecorder ArchiveWeb.page` 浏览器插件，见 `webarchive.zip`


`/root/release`下是一些公共服务的二进制文件

## 部署 clash

1. 下载二进制文件(自行根据最新版本修改指令)，并解压

    ```bash
    wget https://ghproxy.085404.xyz/https://github.com/MetaCubeX/mihomo/releases/download/Prerelease-Alpha/mihomo-linux-amd64-alpha-1d3e9f4.gz
    gzip -d mihomo-linux-amd64-alpha-1d3e9f4.gz
    ```
    
2. 将下载的二进制可执行文件重名名为 mihomo 并移动到 `/usr/local/bin/`

    ```bash
    mv mihomo-linux-amd64-alpha-1d3e9f4.gz mihomo
    cp mihomo /usr/local/bin
    ```

3. 下载配置文件并复制到对应路径下

   ```bash
   curl -o config.yaml "你的订阅链接"
   cp config.yaml /etc/mihomo
   ```
   
4. 授予合适的权限后，启动 clash

    ```bash
    # -d 是配置文件路径，-h 可查看完整文档
    nohup mihomo -d /etc/mihomo > clash.log 2>&1 &
    ```

### 说明

1. `config.yaml`, `cache.db`, `Country.mmdb` 授予组读写权限
2. `mihomo` 授予组执行权限
3. 通过 `nohup` 挂起后，日志会写入 `clash.log` 文件，而 dashboard 中无法查看
    > 想了想，反正 dashboard 的日志界面说实话很一般，真要分析还是看日志文件吧。。。主要是非root启动更安全。如果实在无法接受，通过 systemd 启动服务即可正常使用，见 [虚空终端](https://wiki.metacubex.one/startup/service/)

## 部署 clash dashboard

```bash
git clone https://github.com/metacubex/metacubexd.git -b gh-pages /etc/mihomo/ui
```

更新方式：

```bash
cd /etc/mihomo/ui
git pull -r
# 或者
git -C /etc/mihomo/ui pull -r
```

而后通过 nginx 反向代理，或者访问 `http://ip:9090/ui`都可以。

> 这个端口具体看配置文件的 `external-controller`