---
title: 部署 Neo4j
published: 2024-07-11
category: 教程
# updated: 2024-07-11 18:36:06
# categories: [教程, 软件工程]
---

# 部署 Neo4j

## 下载安装

进入 [neo4j deployment center](https://neo4j.com/deployment-center/)，页面往下拉，找到 **Graph Database Self-Managed**，选择对应配置下载压缩包。

> [!tip]
 > 注意，选择社区版(community)，企业版是收费的。

然后解压出来：

```bash
tar -zxvf neo4j-community-4.4.35-unix.tar.gz
```

进入解压出的路径 `neo4j-community-4.4.35` 后，主要关注两个地方：

1. `bin`：neo4j 的二进制执行文件
2. `conf`：neo4j 的配置文件

通常情况下，需要使用 `bin/neo4j` 来管理 Neo4j 服务，所以还需要配置一个环境变量方便使用：

```bash
vim ~/.bashrc # 或者 ~/.zshrc

# 在最下方插入如下内容(注意替换)
export PATH="path/to/your/neo4j-community-4.4.35/bin:$PATH"

# 保存退出文件

# 生效环境变量
source ~/.bashrc
```

然后执行 `neo4j status`，查看是否正常执行，输出 `Neo4j is not running.` 表示配置成功。

## 配置 jdk11 环境

[Neo4j 4.X 依赖于 jdk11](https://neo4j.com/docs/upgrade-migration-guide/current/version-4/migration/surface-changes/java-api/#_jdk_11)，所以还需要配置一个 Java 环境。

服务器已经在 `/opt` 下部署了常用环境的二进制包，因此直接配置环境变量即可。

```bash
vim ~/.bashrc # 或者 ~/.zshrc

# 在最下方插入如下内容(注意替换)
export JAVA_HOME=/opt/jdk-11.0.22
export PATH=$JAVA_HOME/bin:$PATH
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib

# 保存退出文件

# 生效环境变量
source ~/.bashrc
```

完成后输入 `java --version`，返回如下信息表示配置成功：

```
java 11.0.22 2024-01-16 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.22+9-LTS-219)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.22+9-LTS-219, mixed mode)
```

> [!tip]
> 注意是 java，不是 openjdk 😅

## 配置 Neo4j

由于 Neo4j 社区版只支持单实例，无法做集群，所以多用户使用时，要修改默认端口防止冲突。

> [!tip]
> 可以简单理解为部署一个 neo4j 只能给一个人用，不像数据库，部署一次可以服务多个用户。

Neo4j 的配置通过编辑文件 `conf/neo4j.conf` 进行。

**首先修改 http 端口**。在配置文件中找到如下内容，删除前面的井号 `#` 取消注释，并修改对应的端口：

```
# 修改前
#dbms.connector.http.listen_address=:7474
#dbms.connector.http.advertised_address=:7474

# 修改后
dbms.connector.http.listen_address=:7475
dbms.connector.http.advertised_address=:7475
```

**然后修改 bolt 协议的端口**。

```
# 修改前
#dbms.connector.bolt.listen_address=:7687
#dbms.connector.bolt.advertised_address=:7687

# 修改后
dbms.connector.bolt.listen_address=:7688
dbms.connector.bolt.advertised_address=:7688
```

**最后修改数据库默认的监听地址**。如果你只需要在本机使用 Neo4j，没有局域网访问的需求，可以不做这一步。

```bash
dbms.default_listen_address=0.0.0.0
```

## 使用 Neo4j

```bash
# 启动
neo4j start

# 停止
neo4j stop

# 重启
neo4j restart

# 检查状态
neo4j status
```
