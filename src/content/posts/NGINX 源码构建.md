---
title: NGINX 源码构建
published: 2023-08-03
category: 教程
tags: [linux, nginx, 运维]
# updated: 2024-05-13 20:18:45
# categories: [教程, 搞机]
---
## 下载源码及相关依赖

- [nginx](https://nginx.org/en/download.html)
- [zlib](http://zlib.net/)
- [pcre](https://github.com/PCRE2Project/pcre2/releases)
- [openssl](https://github.com/openssl/openssl/releases)

```bash
# nginx源码
wget https://nginx.org/download/nginx-1.24.0.tar.gz
# pcre
wget https://github.com/PCRE2Project/pcre2/releases/download/pcre2-10.42/pcre2-10.42.tar.gz
# openssl
wget https://github.com/openssl/openssl/releases/download/openssl-3.2.0/openssl-3.2.0.tar.gz
# 解压
tar -zxf nginx-1.24.0.tar.gz
tar -zxf pcre2-10.42.tar.gz -C /usr/local/lib
tar -zxf openssl-3.2.0.tar.gz -C /usr/local/lib
```

## 构建指令

根据实际情况自行修改，见 [nginx中文文档](https://docshome.gitbook.io/nginx-docs/readme/cong-yuan-ma-gou-jian-nginx)

进入 nginx 解压路径，执行下述指令升成 Makefile

```bash
./configure \
--prefix=/usr/local/nginx-1.24.0 \
--with-openssl=/usr/local/lib/openssl-3.2.0 \
--with-pcre=/usr/local/lib/pcre/pcre2-10.42
```

> 由于我部署时，服务器已经具有 `zlib` 环境，因此不添加该参数。

编译安装

```bash
make&&make install
```

完成后可以在 `--prefix` 参数指定的路径下看见 `nginx-1.24.0`。

检查是否部署成功

```bash
# 进入二进制文件所在路径
cd /usr/local/nginx-1.24.0/sbin
# 启动nginx
./nginx
```

访问 `http://IP`，查看是否显示 nginx 欢迎页。

![image.png](https://img.085404.xyz/images/78bca63bb27a22ca66f28d778db6b2c5.png)

## 权限设置

使用 root 用户运行 nginx 不符合**最小授权原则**。应该使用非 root 帐号来运行，即使该进程被攻击，植入了恶意代码，但恶意代码拥有的权限有限，无法对整个系统造成破坏。

添加 nginx 用户组并授予必要权限

```bash
# 创建 nginx 组
groupadd nginx
# 将 nginx 管理人员对应的普通用户加入该组
usermod -aG nginx yzh
# 修改 nginx 程序路径的所属组
chown -Rc root:nginx /usr/local/nginx-1.24.0/
# 日志读写权限
chmod g+w /usr/local/nginx-1.24.0/logs/ -R
# 配置文件写权限
chmod g+w /usr/local/nginx-1.24.0/conf/nginx.conf
```

通过 Linux Capabilities 使普通用户具备部分 root 权限，此处所需权限为 `CAP_NET_BIND_SERVICE`，即允许绑定到小于1024的端口：

```bash
setcap cap_net_bind_service=+ep /usr/local/nginx-1.24.0/sbin/nginx
```

请注意，能力应该授予给源文件，而不是符号链接，否则会报错

```
Failed to set capabilities on file `/usr/local/bin/nginx' (Invalid argument)
The value of the capability argument is not permitted for a file. Or the file is not a regular (non-symlink) file
```

检查能力授予情况

```bash
getcap /usr/local/nginx-1.24.0/sbin/nginx
# 应输出
/usr/local/nginx-1.24.0/sbin/nginx = cap_net_bind_service+ep
```

创建符号链接，使得不用每次都进入 nginx 根路径执行命令

```bash
ln -s /usr/local/nginx-1.24.0/sbin/nginx /usr/local/bin/nginx
```

创建成功后，可以发现在 `/usr/local/bin` 下新增了一个 `nginx`。

使用普通用户登录服务器，尝试在**任意路径**下执行 `nginx`。如提示无权限，修改符号链接的所属组为 `nginx`：

```bash
chown root:nginx /usr/local/bin/nginx
```

如果报错 `nginx: [emerg] open() "/usr/local/nginx-1.24.0/logs/nginx.pid" failed (13: Permission denied)`，可以尝试删除 `nginx.pid` 或者手动修改其权限为组可写。

## nginx 指令

```bash
# 启动nginx
nginx
# 重载配置文件
nginx -s reload
# 停止nginx
nginx -s stop
# 校验配置文件语法
nginx -t
```

修改配置文件后，只需要 `reload` 即可生效。除非有异常情况，才需要先 `stop` 再 `reload`


