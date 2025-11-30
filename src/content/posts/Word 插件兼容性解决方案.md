---
title: Word 插件兼容性解决方案
published: 2024-03-16
category: 教程
tags: [windows, software, env]
# updated: 2024-06-04 12:47:09
# categories: [教程, 科研]
---

# Word 插件兼容性解决方案

## WPS 个人版启用 VBA 环境

> [!bug] 正常情况下企业版内置，个人版需要购买授权才能用。

虽然 WPS 提示要安装 VBA，但实测安装了 VBA7.1 后不起作用，后来看了下网上说的不是 VBA，而是 **WPS VBA 插件**。然后就去下了一个试试：

链接： https://pan.baidu.com/s/16GKbt95d9iCAviKMj2OcOg 
提取码：e27x 


果不其然，并不是 VBA 的 msi 程序，而是一个 exe，运行后出现的是 `kingsoft` 界面，看来是给 WPS 软件打的补丁。

安装完成后，即可正常使用 zotero 等软件。
## WPS 中启用 MathType

> [!warning] 适用于较新的 WPS 12.0+ 以及 MathType 7.0+，其他版本未做测试！

与 Zotero 不同，MathType 这玩意即使安装完成也不会自动配置 WPS，具体体现在两个问题：

1. WPS 启动后没有 MathType 选项卡（缺少了相应的 `dotm`）
2. 加载 `dotm` 以显示选项卡后，插入公式会报错找不到 `MathPage.wll`

下面分别介绍如何解决。

### 让 WPS 显示   MathType 选项卡

对于 `dotm` 文件的问题，不要试图在**工具-加载项**这里添加。在这里添加虽然可以正常显示选项卡，但不会随着 WPS 自启动。所以你需要做的是：

1. 找到 MathType 的安装路径
    > 什么？你不知道怎么找？右键 MathType 的快捷方式，点击 `打开文件所在位置`。你要是连快捷方式也不知道怎么找的话，建议 remake
2.  进入 `\Office Support\32` 这个路径，这里面存放着适用于 32 位 office 的 `dotm` 模板文件
    > 至于为什么是 32 位，那得问问金山为什么 2024 年还在生产 32 位的电子垃圾了。别扯什么兼容性，提供 32/64 两种安装包就能解决的问题。
3. 找到 `MathType Commands 2016.dotm` 这个文件，复制粘贴到 `*\WPS Office\12.1.0.16412\office6\startup` 路径下。
    > 这个路径是你 WPS 的安装路径，切记**粘贴到版本号最新的那个路径下**，因为我们的 WPS 居然把占用庞大的历史版本软件也保存在了用户机上，真是国产之光呢^_^

至此，重启 WPS，应该就可以看到 MathType 的选项卡了，不过应该是无法使用的。

### WPS 中使用 MathType 报错找不到 mathpage.wll 文件

解决步骤如下：

1. 找到 MathType 安装路径，进入 `\MathPage\32`
2. 里面只有一个 `MathPage.wll`，依然复制粘贴到 `*\WPS Office\12.1.0.16412\office6\startup` 路径下

> [!warning] `dotm` 文件和 `MathPage.wll` 文件需要一一对应，要么全是 32 位，要么全是 64 位！

## WPS 启用 Zotero

正常情况下，WPS 会自动加载属于 Office Word 的 `Zotero.dotm`，即 ` ` `C:\Users\y2pub\AppData\Roaming\Microsoft\Word\Startup\Zotero.dotm`。但此时可能由于软件升级或别的什么原因，导致 WPS 出现异常，即可见选项卡但无法使用 Zotero。

因此，找到 `Zotero安装路径/extensions`，打开文件夹，里面有一个 `Zotero.dotm`

> 如果是 Zotero7 的测试版，该文件在 `Zotero安装路径/integ ration/word-for-windows/` 下。

将其**复制**到 `C:\Users\y2pub\AppData\Roaming\Microsoft\Word\Startup\`。然后重启 WPS 即可。

当然，你也可以选择给两个软件分别配置 `Zotero.dotm`，注意事项，见上文[让 WPS 显示 MathType 选项卡](#让%20WPS%20显示%20MathType%20选项卡)。

## 关于 Office Word

1. 开启 MathType 选项卡的方式与 WPS 类似，只是路径不同，为：`C:\Program Files (x86)\Microsoft Office\root\Office16\STARTUP`
2. 报错 `mathpage.wll` 时，相关路径为：`C:\Program Files (x86)\Microsoft Office\root\Office16`

> 有的是 x86 路径，有的是 x64 路径，都看看

注意，office 365 似乎无需手动配置，默认启动。