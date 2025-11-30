---
title: 浏览器cookie迁移
published: 2023-06-04
description: 一种可以迁移浏览器cookie的方法，能够将一个浏览器的登录信息切换到另一个浏览器上，实现无缝对接，避免诸多账号重新登陆的麻烦。
category: 教程
tags: [software, browser]
# updated: 2023-06-04 12:14:27
# categories: [教程, 搞机]
---

软件出处为[吾爱破解](https://www.52pojie.cn/forum.php?mod=viewthread&tid=1516149)

也可以直接前往作者提供的[下载地址](https://www.lanzoui.com/it2eSu9f6af?w)

当然，优质资源自己也要做好备份的。如果上述链接挂了，可邮箱联系我发送。

## 使用方式

解压后，会看到 `.exe` 文件，双击后会在当前目录下生成两个 `.dll`

![image.png](https://img.085404.xyz/images/9d19591540c1a3197381e6b8de6babd9.webp)


在上面的选择栏中，选中**迁出** cookie 的浏览器，例如 edge 的路径 `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`

在下面的选择栏中，选中**迁入** cookie 的浏览器，例如 Chrome 的路径 `"C:\Program Files\Google\Chrome\Application\chrome.exe"

点击迁移，工具左上角会显示进度数值 `已完成数/总cookie数` ，耐心等待一会即可。

![image.png](https://img.085404.xyz/images/d6a665b2eef7a5fac51d0e8d42587604.webp)
