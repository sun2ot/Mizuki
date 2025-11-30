---
title: steam的cdn问题
published: 2023-04-12
description: 通过steam下载游戏时，本地带宽无法跑满，可能是由于cdn不恰当的问题。本文解析代理和直连模式下访问steam时，对cdn产生的影响。
category: 教程
tags: [cdn, game]
# updated: 2023-05-24 16:49:53
# categories: [教程, 搞机]
---

1. 浏览器地址栏输入 `steam://open/console` 可启动 steam 控制台
2. 控制台内输入 `user_info` 可显示当前用户信息
![image.png](https://img.085404.xyz/images/54fc508f66e6d2c4f42daff43c214379.png)

其中的 `IPCountry` 取决于**登录** steam 账号时的网络环境（IP）

所以，如果你是开启代理的情况下登录 steam，那么在国区下载游戏时，**即使给 steam 设置的分流规则为 direct**，steam 仍然会按照你的 `IPCountry` 来为你就近分配 CDN，如下图（本体 500 M 家宽，下载游戏时实际只有 160 M 的速度）

![image.png](https://img.085404.xyz/images/de6f48a955e8179512def2e6d14f3d49.png)

手动指定下载地区**没有任何卵用**，以你登录时的地区为准

![image.png](https://img.085404.xyz/images/73e387513da7885722d95d8d927ae416.png)
