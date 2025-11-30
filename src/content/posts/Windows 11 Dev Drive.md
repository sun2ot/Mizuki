---
title: Windows 11 Dev Drive
published: 2024-03-11
category: 教程
tags: [microsoft]
# updated: 2024-06-17 17:25:14
# categories: [教程, 搞机]
---

# Windows 11 Dev Drive

> 在 2023 年的微软开发者大会上，推出了 Dev Drive 新存储卷。从今天开始，Dev Drive 将面向所有使用最新 Windows 11 的 Windows 开发者开放。

对于这个巨硬推出的新玩具，网上相关资料较少，因此这里做一个记录。

[About Dev Drive on Windows 11 by Microsoft Official](https://learn.microsoft.com/zh-cn/windows/dev-drive/)

## 受信与反病毒策略

管理员模式运行 powershell：

```powershell
# 将开发驱动器指定为受信任的驱动器
fsutil devdrv trust <drive-letter>:

# 查询开发驱动器是否受信任
fsutil devdrv query <drive-letter>:
```

> 不能将计算机上的 C: 驱动器指定为开发驱动器。开发人员工具（如 Visual Studio、MSBuild、.NET  SDK、Windows SDK）应存储在 C:/ 驱动器上，而不是存储在开发驱动器中！

默认情况下，[筛选器管理器](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/ifs/filter-manager-concepts) 将关闭开发驱动器上的所有筛选器，防病毒筛选器除外。当然，我们也可以关闭。

如果你的电脑上运行了 Windows Defender 或者 360 之类的安全软件，执行 `fsutil devdrv query` 大概率会看到有相关字样。由于个人小鸡基本不存在病毒攻击的问题，因此这里我们可以将防病毒策略完全关闭以提高开发驱动器的性能：

```powershell
fsutil devdrv enable /disallowAv
```

然后检查效果：

```powershell
# 再次查询
fsutil devdrv query <drive-letter>:

# 结果如下
This isNo filters are currently attached to this developer volume.
```

## 自动挂载

由于新电脑有两个硬盘位，所以在从盘位划分了一块作为 Dev driver。但奇怪的是，虽然正常使用，但开机、重启时无法自动挂载，必须手动找到 `VHDX` 文件进行挂载。暂不清楚是什么原因导致的，但总之，在微软 devhome 项目的 [issue #1903](https://github.com/microsoft/devhome/issues/1903#issuecomment-1916919629) 找到了解决方案。

简单来说就是新建一个计划任务，然后用 `diskpart.exe` 执行一段磁盘挂载的脚本即可。

