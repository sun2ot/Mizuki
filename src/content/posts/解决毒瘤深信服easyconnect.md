---
title: 解决毒瘤深信服easyconnect
published: 2025-02-20
category: 教程
# updated: 2025-02-21 23:10:42
# categories: [教程, 搞机]
---

## 简介

深信服的恶名由来已久，我校不出意外也是使用该公司的 EasyConnect 进行 VPN 连接。由于全局 VPN 走校园网会导致网速缓慢（因为校园网慢啊），且校方当地的网络🚔似乎挺缺业绩的，因此需采取一定的手段封印这个毒瘤软件。

## 部署 docker-easyconnect

[docker-easyconnect: 使深信服（Sangfor）开发的非自由的 VPN 软件 EasyConnect 和 aTrust 运行在 docker 或 podman 中，并作为网关和/或提供 socks5、http 代理服务](https://github.com/docker-easyconnect/docker-easyconnect)。

按照官方文档给出的案例启动即可，这里为了方便后期维护，将其改写为 `docker-compose.yaml` 的形式以便管理：

```yaml
services:
  easyconnect:
    image: hagb/docker-easyconnect:cli
    container_name: easyconnect
    devices:
      - /dev/net/tun
    cap_add:
      - NET_ADMIN
    volumes:
      - $HOME/.easyconn:/root/.easyconn
    ports:
      - "127.0.0.1:1080:1080"
      - "127.0.0.1:8888:8888"
    environment:
      - EC_VER=7.6.7
      - EXIT=1
      - CLI_OPTS=-d xxx.edu.cn -u xxx -p xxx
```

关于各参数的作用，参考 [doc/usage](https://github.com/docker-easyconnect/docker-easyconnect/blob/master/doc/usage.md) 即可，这里只对几个关键参数做出说明。

docker-easyconnect 有命令行与图形化界面两种部署形式。由于我校的 VPN 仅需学号 + 密码即可登录，因此只需要命令行部署即可。

在上述的配置文件中：
- `ports`：端口映射，其中 `1080` 为 http 端口，`8888` 为 socks 端口
- `EC_VER`：easyconnect 的版本，可选 7.6.7/7.6.3，参考 [EasyConnect 版本选择](https://github.com/docker-easyconnect/docker-easyconnect/blob/master/doc/usage.md#easyconnect-%E7%89%88%E6%9C%AC%E9%80%89%E6%8B%A9)
- `CLI_OPTS`：配置登录信息，其中 `-d` 指定 VPN 域名，`-u` 指定用户名，`-p` 指定密码

## 使用方式

编辑好镜像文件后，即可启动容器：

```bash
docker compose -f xxx.yaml up -d
```

由于我是在 **WSL2** 下配置镜像模式使用的，因此容器的网络与宿主机网络完全一致，因此只需要在需要代理的软件中进行配置即可。

> 关于部署 WSL，可参考 [Blog: WSL Docs](https://blog.085404.xyz/method/wsl.html)

例如 ssh 连接内网服务器，只需要设置 proxy （假设使用 socks 代理）为 `127.0.0.1:8888` 即可登录。

## 存在的问题

[issue 423](https://github.com/docker-easyconnect/docker-easyconnect/issues/423)

~~暂不清楚什么原因，虽然成功登录，并且可以连接内网服务器，但浏览器设置代理时会访问失败，这导致一些需要校园网络环境的在线服务（如文献）等无法使用容器代理。该问题尚未解决，有待后续补充。~~

上述问题已解决，原因可参考 [issue 154](https://github.com/docker-easyconnect/docker-easyconnect/issues/154)，主要是容器内的 dns 存在问题。按照作者给出的 `iptables` 方法无法解决，经测试可以通过以下方式解决该问题。

由于 dns 故障，因此对于域名无法解析，此处需分为三种情况：
1. **内网域名可被公开 DNS 解析**：此时只需要让代理请求能够在不依赖容器代理的情况下获得该域名的 IP 地址即可，参考下文；
2. **内网域名且只能被私有 DNS 解析**：这种情况我暂未遇到，故暂不做考虑。但解决方式可能与情况 1 的一致；
3. **内网页面直接通过 IP 访问**，无需域名：这种情况将不会受到 DNS 的干扰，因为无需解析域名获得 IP。

针对情况 1，可以借助 Clash 来完成域名的解析，这里我使用的是 [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)，其基于 [Meta 内核](https://github.com/MetaCubeX/mihomo) 构建。主要是需要代理内核支持 `hosts` 设定即可。

在 Clash 的配置文件中，添加如下内容：

```yaml
hosts:
  xxx.edu.cn: 1.2.3.4  # 更换为对应的 IP 地址
```

通过在代理内核中增加 hosts 映射，然后在浏览器中设置代理请求转发到 Clash，即可在容器代理之外获得域名对应的 IP 地址，从而绕过项目原有的 DNS Bug。
