---
title: Windows CPU 睿频设置
published: 2025-02-18
category: 教程
# updated: 2025-02-18 11:15:52
# categories: [教程, 搞机]
---
## 关闭睿频

Windows 10 可以通过设置电源模式为节能模式实现关闭睿频，Windows 11 需借助电源计划实现。

打开“控制面板 - 硬件和声音 - 电源选项”，默认的电源计划为 `平衡`。为使修改的电源计划在重启后仍然生效，需 `创建电源计划`：

![image.png](https://img.085404.xyz/images/8cdeeb910973be267815a47a1bd66d28.webp)

电源计划名字任意，点击 `下一页` 即可创建完成。

点击创建的电源计划右侧的 `更改计划设置`，然后 `更改高级电源设置`:

![image.png](https://img.085404.xyz/images/91391b76155c1a5a0779e355a36893a4.webp)

在弹出的电源选项中，找到 `最大处理器状态`，将下方的两个值从 100% 修改为 99% 即可关闭 CPU 睿频：

![image.png](https://img.085404.xyz/images/66a506aedf1ebd0823bdff8be03179ed.webp)

## 设置处理器频率

默认情况下，电源计划中“处理器电源管理”是没有 `处理器最大频率` 的设置项的，需要在注册表中手动开启。

找到注册表项：

```
计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\75b0ae3f-bce0-45a7-8c89-c9611c25e100
```

修改其中的 `Attributes` 值为 2 即可。

![](https://i-blog.csdnimg.cn/blog_migrate/cc8624ebf7710315db96c8cabbe98dbf.png)

