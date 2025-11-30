---
title: ss订阅链接加密解析
published: 2024-03-30
category: 教程
tags: [GFW, clash]
# updated: 2024-03-30 12:37:39
# categories: [教程, 搞机]
---
 
对于一个已经部署好的 Shadowsocks 节点，在 Clash 中的配置参数如下：

```yaml
proxies:
  - {name: node, server: 192.168.1.1, port: 8388, type: ss, cipher: chacha20-ietf-poly1305, password: 123456, udp: true}
```

我们通常看到的 ss 订阅链接如下：

```
ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNToxMjM0NTZAMTkyLjE2OC4xLjE6ODM4OA
```

这其实是一个经过 urlsafe_base64 加密后得到的字符串：

```
Encode bytes using the URL- and filesystem-safe Base64 alphabet.

Argument s is a bytes-like object to encode. The result is returned as a bytes object. The alphabet uses '-' instead of '+' and '_' instead of '/'.
```

换言之，只要先对 ss 链接进行 base64 解码，即可得到相关参数：

> 注意：只解码 `ss://` 后面的内容

```
chacha20-ietf-poly1305:123456@192.168.1.1:8388
```

这也就是上文我们给出的 Clash 节点配置信息。而 ss 链接在没有进行 base64 加密前的格式，正是：

```
ss://method:password@server:port  
```

显然，这存在一个问题：`name` 和 `udp` 参数不在其中。换言之，如果你将自己的 Shadowsocks 节点配置按照如上方式加密，得到的 ss 订阅链接是无法解析出 `name` 和 `udp` 参数的。

通过联合 subconverter 进行研究，我发现一个适用于 Clash 的 ss 订阅链接格式如下：

```
ss://url_base64(method:password@server:port?udp=1)#name
```

- url_base64 只加密 `ss://` 与 `#name` 之间的内容
- 带有 `?udp=1` 则会解析出 `udp=true`；反之则不会
- `#name` 直接添加在加密完成后的完整 ss 链接后

当然，`@server:port` 部分也可以不加密：

```
ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpwYXNzd29yZA@www.example.com:1080#name
```

