---
title: Windows 计划任务备份方案
published: 2024-03-11
category: 教程
tags: [microsoft, auto]
# updated: 2024-03-11 10:52:51
# categories: [教程, 搞机]
---

## 任务需求

需要对位于 `D:\` 下的 obsidian 文件夹中的所有文件进行定时全量备份。

## 操作步骤

快捷键按 Win+R 打开运行输入 taskschd.msc 打开 “任务计划程序”，创建一个基本任务。

![image.png](https://img.085404.xyz/images/43716f61f311931735ac142f0648f95e.webp)

名称可以自己任意填，描述可不填。

![image.png](https://img.085404.xyz/images/b25441b33b4df4ec8617e7b5bca938b4.webp)

点击下一页，任务触发器选择每天

![image.png](https://img.085404.xyz/images/ef192ec16a77db9c953c7ddf873605da.webp)


设置每天自动备份的具体时间，设置完成后点击 “下一步” 按钮。

![image.png](https://img.085404.xyz/images/f2ea62e165cc9158492aceaee92ed2fb.webp)

选择要启动的程序，填入相应参数，然后点击 “下一步” 按钮。这里我设置的任务是调用 powershell 执行对应[脚本](https://gist.github.com/sun2ot/9d27ebeaae4a4294b335f0b8349de5f1)，实现将路径下文件打成压缩包后移动到另一个盘实现备份效果。

![image.png](https://img.085404.xyz/images/6ec1b3189c0962aa746b9b5e16aa2eff.webp)

> 注意这里的程序路径如果有空格，切记加引号。或者点击 `浏览` 一步一步选中目标程序即可。

填好后点击 “下一步”，然后点击完成按钮，保存任务计划。

![image.png](https://img.085404.xyz/images/c520c023a1a165bcdf9598fffcb5ae08.webp)


![image.png](https://img.085404.xyz/images/04f40342c3413a302f4a3a0216ff4a6a.webp)

点击 `更改用户或组`

![image.png](https://img.085404.xyz/images/be447e5cab740790267a008c4575bc3e.webp)


注意，如果前面的设置有误，或者想要修改，这里是可以更改的（上方的菜单栏）

![image.png](https://img.085404.xyz/images/b74fc94615f76d26243024efb43bcc7d.webp)

在条件中，取消勾选电源选项

![image.png](https://img.085404.xyz/images/35da9641b0b8441a0c10b25ed8dc8d6f.webp)

在设置中，勾选如上选项

设置完成后，右键任务尝试运行

![image.png](https://img.085404.xyz/images/36241eeeee479aa8d9181482ce7f46d1.webp)
