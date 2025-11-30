---
title: Windows 所有操作都无法以普通权限启动
published: 2023-07-04
category: 教程
tags: [windows, bug, powershell]
# updated: 2023-07-04 16:08:31
# categories: [教程, 搞机]
---

## 背景

重装系统时偷了懒，用了 PE 里自带的一键装机，结果默认将 Windows 的超级管理员用户 `Administrator` 用户开启，还用了一晚上。

结果第二天发现这玩意问题有点多，其中一个就是**所有的终端默认都是以管理员模式启动**，无论你是否点击 `以管理员模式启动` 。这就导致部分程序完全无法执行

> 出于安全考虑，部分软件/程序是无法在 root/admin 模式下执行的

## 解决方案

如果是家庭版用户，先安装**组策略**

> 将下列文本拷贝到 txt 文件中，再将文件后缀修改为 `.cmd` ，以管理员模式执行即可。

```
@echo off
pushd "%~dp0"
dir /b C:\Windows\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientExtensions-Package~3*.mum >List.txt
dir /b C:\Windows\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientTools-Package~3*.mum >>List.txt
for /f %%i in ('findstr /i . List.txt 2^>nul') do dism /online /norestart /add-package:"C:\Windows\servicing\Packages\%%i"
pause
```

`win + r` 运行 `secpol.msc` ，将红框的两个选项设置为如图所示，然后**重启电脑**即可。

![image.png](https://img.085404.xyz/images/202307041518748.webp)


## 关闭 Administrator

如果你不想使用超管用户（其实 Windows 默认是关闭这个用户的），可以在**管理员命令提示符**执行如下指令

```powershell
# 关闭超管
net user administrator /active:no
# 开启超管
net user administrator /active:yes
```

> [!warning] 
> 如果你电脑上目前就只有一个超管用户，没有其他用户，那就先别慌禁用，去创建一个新用户再禁用，否则你重启之后就进不了系统了，得做 PE 去折腾。。。


```powershell
# 新建一个用户 username，密码是 password
net user username password /add

# 添加 username 到 Administrators 组
net localgroup Administrators username /add
```

