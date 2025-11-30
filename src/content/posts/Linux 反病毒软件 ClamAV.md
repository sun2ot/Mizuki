---
title: Linux 反病毒软件 ClamAV
published: 2025-03-03
category: 教程
# updated: 2025-03-04 09:35:22
# categories: [教程, 搞机]
---

## 介绍

Linux 操作系统以其强大的权限管理和开源特性而闻名，相比其他操作系统（如 Windows），它确实更不容易受到病毒和恶意软件的攻击。但某些时刻的确需要一个防病毒软件，可以考虑使用 [ClamAV：一款开源的防病毒引擎](https://www.clamav.net/)。

## 安装

安装 clamav 及其守护进程

```bash
sudo apt update
sudo apt install clamav clamav-daemon
```

执行 `clamscan --version`，显示版本信息说明安装成功。

## 使用

### 更新病毒库

第一次安装后，需要手动更新病毒库：

```bash
# 先暂停病毒库后台服务，否则无法更新
sudo systemctl stop clamav-freshclam

# 更新病毒库数据
sudo freshclam

# 启动 clamav 服务
sudo systemctl enable clamav-freshclam --now
```

### 查看病毒数据库目录及日期

```bash
ls -l /var/lib/clamav
```

### 扫描文件

默认情况下，clamav 需要手动调用 `clamscan` 以扫描文件/目录：

```bash
# -r 递归扫描
clamscan [-r] /path/to/file_or_path
```

clamav 会在终端显示扫描过程和结果，如果需要记录到日志，使用 `-l` 参数：

```bash
clamscan /path/to/scan -l /path/to/logfile
```

其他常用参数：
- `-i`：`inject`，仅显示（病毒）感染文件，避免大量刷 Log
- `--remove`：扫描到感染文件后删除该文件
- `--help`：帮助信息

### 脚本示例

以家目录为例，扫描是否存在感染文件。可以添加到 crontab 定时执行。

```bash
#!/bin/bash

SCAN_DIR="/home"
EXCLUDE_LIST=(
    "^/home/user1(/.*)?$"
    "^/home/[^/]+/miniforge3(/.*)?$"
    "^/home/[^/]+/\.conda(/.*)?$"
)

EXCLUDE_ARGS=""
for item in "${EXCLUDE_LIST[@]}"; do
    if [[ "$item" =~ \(/.*\)\?$ ]]; then
        EXCLUDE_ARGS+=" --exclude-dir='/$item/' "
    else
        EXCLUDE_ARGS+=" --exclude='/$item/' "
    fi
done

LOG_FILE="/var/log/clamav_home_scan.log"
echo "Scan started at $(date)" >> "$LOG_FILE"
clamscan -r $EXCLUDE_ARGS "$SCAN_DIR" >> "$LOG_FILE" 2>&1
echo "Scan completed at $(date)" >> "$LOG_FILE"
```

## 参考文献

- [系统极客：如何安装、配置和使用 ClamAV，守护 Ubuntu 系统安全](https://www.sysgeek.cn/install-clamav-on-ubuntu/)
- [亚马逊 AWS 官方博客：在 EC2 Linux 操作系统上部署 ClamAV 并开启实时防护、集中日志采集和统一告警](https://aws.amazon.com/cn/blogs/china/deploy-clamav-on-ec2-with-realtime-scan-and-centralized-alarm/)

