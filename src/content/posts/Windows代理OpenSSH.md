---
title: Windows平台代理OpenSSH
published: 2024-03-10
category: 教程
tags: [ssh, GFW, software]
# updated: 2024-03-12 16:36:18
# categories: [教程, 软件工程]
---

百度搜到的很多给 SSH 设置代理的方法，都是抄来抄去的，就是 `ProxyCommand nc -v -x 127.0.0.1:1080 %h %p` 。

但是这分明是给 Linux 用的， Windows 上哪里来的 nc 程序？

所以以下操作才是给 Windows 用的。

在自己的用户文件夹找到 `.ssh` 文件夹，在里面新建一个空白文件，取名 config，如果已经有了就不用创建了。

在 config 文件加上：

```yaml
Host 自定义名称
  HostName 服务器的IP/域名
  User 登录用户名
  IdentityFile C:\Users\你的win用户名\.ssh\id_rsa
  ProxyCommand "D:\environment\Git\mingw64\bin\connect.exe" -S 127.0.0.1:7890 %h %p  
```

这里 git 的安装路径和后面的代理自己看着填。后面的代理， `-S` 指是 socks 代理，默认是 socks5， `127.0.0.1:7890` 就是你本地的代理地址，后面的 `%h %p` 意思是 Host 和 Port。如果要使用 HTTP 代理，就写 `-H` 。

当然，不难发现这里其实调用的是 Git 中的 connect.exe 程序，如果没有或者不想安装 Git，完全可以用独立程序代替，下载方式如下：

```
scoop install main/connect
```

由于这个程序已经相当古老了，因此只能在[互联网存档](https://web.archive.org/web/20080516100455/http://www.meadowy.org/~gotoh/projects/connect)中找到。