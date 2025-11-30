---
title: Linux 部署 MATLAB
published: 2024-03-25
category: 教程
tags: [crack, linux, matlab]
# updated: 2024-03-25 20:08:41
# categories: [教程, 科研]
---

## Warning

1. MATLAB 是收费软件，且学校没有购买授权，因此只能安装破解版。
2. 本教程全过程需 root 权限，但完成后普通用户可以使用。

## 下载 MATLAB 镜像及破解补丁

这里提供 R2019b 和 R2020a 两个版本。其中前者为服务器已经部署的版本，后者为网络资源，可用性未知，仅作参考。

```
# R2019b
链接：https://pan.baidu.com/s/1AZ_LmyzfTUJ4nGzOBaTghg 
提取码：7pso 
--来自百度网盘超级会员V6的分享

# R2020a
链接：https://pan.baidu.com/s/1LHSmd7nC8x6QmziyYt6whQ 
提取码：cmmd 
--来自百度网盘超级会员V6的分享
```

由于属于盗版资源，因此无直链可以提供。但可以通过 Alist 中转请求的方式满速下载到服务器（前提是你有百度网盘的会员）。

```bash
curl -L -X GET "https://xxx/d/xxx/R2019b_Linux.iso" -H "User-Agent: pan.baidu.com" -o R2019b_Linux.iso
```

> 之所以不先下载再上传，是因为司马校园网。希望后来者的实验条件不要如此艰苦。。。

## 安装 MATLAB

```bash
# 创建临时挂载路径
mkdir /mnt/matlab

# 挂载 iso 镜像
## -o loop: 将文件视为块设备。这样可以让你像挂载硬盘分区一样挂载一个文件。
mount -o loop R2019b_Linux.iso /mnt/matlab

# 退出挂载路径后再安装
cd ~
# 执行指令静默安装
## 注意替换参数：
## - destinationFolder: 安装路径
## - activationPropertiesFile: 破解补丁路径
/mnt/matlab/install -mode silent -fileInstallationKey 09806-07443-53955-64350-21751-41297 -agreeToLicense yes -activationPropertiesFile Matlab-R2019b-Linux64-Crack/license_standalone.lic -destinationFolder /opt/matlab2019b/

# 也可以直接 /mnt/matlab/install，不过需要打开 X11 显示，然后对照着上面的信息在 GUI 中填进去。听不懂的话就略过这一段吧。

# 等待安装...很久...大概10min?
```

输出如下结果即安装完成：

```
(三月 25, 2024 19:00:27) Exiting with status 0
(三月 25, 2024 19:00:29) End - Successful.
Finished
```

## 注入破解补丁

注意，是破解补丁包里的文件往安装路径下复制。

```bash
# 解压破解补丁包
tar -zxvf Matlab-R2019b-Linux64-Crack.tar.gz

# 注入启动组件破解补丁
cp Matlab-R2019b-Linux64-Crack/R2019b/bin/glnxa64/* /opt/matlab2019b/bin/glnxa64/ -r

# 注入破解许可证
cp Matlab-R2019b-Linux64-Crack/license_standalone.lic /opt/matlab2019b/licenses
```

至此，root 用户应该可以执行 `/opt/matlab2019b/bin/matlab` 启动MATLAB(需开启 X11)。但普通用户尚且无法启动，仍会提示需要激活，原因是相关破解补丁权限为 root，普通用户无法读取，因此需要修改相关权限。

```bash
# 新增 matlab 用户组
groupadd matlab
# 将需要使用 matlab 的用户添加进组
usermod -aG matlab u_23_1,yzh
# 修改 matlab 文件的所属组为 matlab
chown root:matlab ./matlab2019b/ -R
# 修改 matlab 文件的权限为 775
chmod 775 matlab2019b/ -R
```

至此，普通用户可通过 `/opt/matlab2019b/bin/matlab` 顺利启动 MATLAB。如需配置环境变量，在 `.bashrc` 或 `.zshrc` 中添加`export PATH=/opt/matlab2019b/bin:$PATH` 即可。