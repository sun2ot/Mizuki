---
title: 二进制部署 MySQL
published: 2025-04-30
category: 教程
tags: [运维, SQL]
# updated: 2025-04-30 15:45:44
---

## 下载

官网下载 [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

![1745995346881.png](https://img.085404.xyz/images/f92e6cabf60e9147327880b713bf1107.webp)

这里的 glibc 版本视情况选择合适的版本。工作站系统更新过，可以直接部署 glibc 2.28 版本。云服务器系统过于老旧，请使用 glibc 2.17 版本。

![1745995480809.png](https://img.085404.xyz/images/e9021f010d0baacb78fd0cc3736d2174.webp)

下载对应的压缩包。如无特殊需求，直接选体积最大的那个拉满即可。

## 解压

解压压缩包到 `/usr/local` 下

```bash
sudo tar -xJvf mysql-8.4.5-linux-glibc2.28-x86_64.tar.xz -C /usr/local
# 重命名一下文件名，方便后续操作
sudo mv /usr/local/mysql-8.4.5-linux-glibc2.28-x86_64 mysql
```

为了便于后续操作，先配置环境变量

```bash
export "/usr/local/mysql/bin" >> ~/.bashrc
source ~/.bashrc
```

## 初始化

创建系统用户和数据目录，为启动 MySQL 做准备

```bash
# 新建 mysql 用户（无登录 shell）
sudo useradd -r -s /bin/false mysql

# 建立数据目录并授权
sudo mkdir -p /mnt/mysql/data
sudo mkdir -p /mnt/mysql/log
sudo chown -R mysql:mysql /mnt/mysql
```

> 工作站的 MySQL，数据目录是一个 512G 的逻辑卷，挂载在 `/mnt/mysql` 下。

初始化数据目录（只需要执行一次）。这里只是初始化，还没有启动 MySQL。

```bash
sudo /usr/local/mysql/bin/mysqld \
  --initialize-insecure \
  --basedir=/usr/local/mysql \
  --datadir=/mnt/mysql/data \
  --user=mysql
```

> 这样 root 初始无密码，后续可用 ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrong!Pass'; 设置密码。

编写 MySQL 配置文件：在 `/mnt/mysql` 下新建一个 `my.cnf`，插入以下内容并保存。

```ini
[client]
port            = 3306

[mysqld]
user            = mysql
port            = 3306
# 开启局域网访问
bind-address    = 0.0.0.0
basedir         = /usr/local/mysql
datadir         = /mnt/mysql/data

# 日志
log-error       = /mnt/mysql/log/mysql.err

# 国际化与插件目录（解决找不到 errmsg.sys、.so 问题）
lc-messages-dir = /usr/local/mysql/share
plugin-dir      = /usr/local/mysql/lib/plugin

# 可根据需要添加优化项，例如：
# max_connections = 200
# innodb_buffer_pool_size = 1G
```

## 配置 MySQL 服务

在 `/etc/systemd/system` 下新建一个 systemd 单元文件 `mysqld.service`

```bash
sudo vim /etc/systemd/system/mysqld.service
```

插入以下内容：

```ini
# /etc/systemd/system/mysqld.service

[Unit]
Description=MySQL Community Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mysql
Group=mysql

# 启动命令
ExecStart=/usr/local/mysql-8.4.5-linux-glibc2.28-x86_64/bin/mysqld --defaults-file=/mnt/mysql/my.cnf

# 停止命令
ExecStop=/usr/local/mysql-8.4.5-linux-glibc2.28-x86_64/bin/mysqladmin \
  --defaults-file=/mnt/mysql/my.cnf \
  shutdown

# 异常时自动重启
Restart=on-failure
# 对于“正常退出”（exit code 0）不重启
RestartPreventExitStatus=0

# 打开文件句柄数上限
LimitNOFILE=5000

[Install]
WantedBy=multi-user.target
```

保存后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable mysqld
```

## 启动 MySQL

```bash
# 启动
sudo systemctl start mysqld

# 查看状态
sudo systemctm status mysqld

# 停止
sudo systemctl stop mysqld

# 重启
sudo systemctl restart mysqld
```

启动 MySQL 后，测试是否能够正常连接

```bash
mysql -uroot -p
```

由于上面通过 `--initialize-insecure` 参数初始化 MySQL，因此 root 用户默认密码为空，直接回车登录即可。

确认登录成功后，重新设置 root 密码（强密码）：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrong!Pass';
```

## 权限配置

按照上述操作启动 MySQL 后，在终端可以通过 root 进行登录，但是通过远程连接是无法登录的。因为 MySQL 的用户是**用户名 + 主机**两元组控制的：

| 用户           | 允许登录来源                    |
| -------------- | ------------------------------- |
| root@localhost | 仅限本机（localhost/127.0.0.1） |
| root@IP        | 允许从 IP 访问                  |
| root@%         | 允许从任意主机访问              |

如果是自己本机部署 MySQL 开发，root 用户裸奔无所谓。但是服务器部署就需要考虑权限问题，十几个人通过一个 root 账户进行开发是很傻逼的行为。

对于每个用户，按照最小权限原则，只需要授予其需要使用的数据库权限即可。一般一人一个即可，如果有协作开发场景，那就授予多人这个库的权限。

首先，创建数据库。

```sql
CREATE DATABASE dev_yzh;
```

然后，创建需要使用这个库的用户（这个一次就够了，后续都是这几个用户）。

```sql
CREATE USER 'yzh'@'172.26.%' IDENTIFIED BY '用户yzh的密码';
```

> 这里使用 `%` 通配符对 IP 进行了限制，即分配 IP 的 172.26 网段。

授予用户 `yzh` 数据库 `dev_yzh` 的所有权限。

```sql
GRANT ALL PRIVILEGES ON dev_yzh.* TO 'yzh'@'172.26.%';
FLUSH PRIVILEGES;
```

也可以对权限进行限制，只授予表结构变更和数据操作的权限，保留全局管理操作的权限：

```sql
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER
  ON dev_yzh.* TO 'yzh'@'172.26.%';
```

还可以通过 MySQL 8.0+ 的角色模板进行管理。