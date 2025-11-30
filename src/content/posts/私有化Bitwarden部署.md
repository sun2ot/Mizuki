---
title: 私有化Bitwarden部署
published: 2024-04-14
category: 教程
# updated: 2024-05-07 14:16:08
# categories: [教程, 搞机]
---

# 私有化 Bitwarden 部署

>  [vaultwarden](https://github.com/dani-garcia/vaultwarden) is an **unofficial** Bitwarden compatible server written in Rust, formerly known as bitwarden_rs.

## 拉取镜像

按理说部署 docker 需要先拉取镜像，不过这里使用 `docker-compose` 来启动，所以只需要准备好对应的 `docker-compose.yml` 文件然后启动即可，拉取镜像会自动执行。所以直接从配置项入手。

## 配置项

### 禁止新用户注册

默认情况下，任何能够访问后端的人都可以在此注册新账户，该功能可通过设置环境变量 `SIGNUPS_ALLOWED` 为 `false` 进行关闭：

```bash
docker run -d --name bitwarden \
  -e SIGNUPS_ALLOWED=false \
  -v /vw-data/:/data/ \
  -p 80:80 \
  vaultwarden/server:latest
```

需要注意的是, 现在注册和邀请功能仍然显示在页面上, 但是实际尝试注册和邀请会报错误消息。因为官方 **Bitwarden server API** 是一个开放平台, 所以无法完全禁用。

### 禁止组织邀请

即使 `SIGNUPS_ALLOWED=false` ，作为组织所有者或管理员的现有用户仍然可以邀请新用户。可以通过将 `INVITATIONS_ALLOWED` 环境变量设置为 `false` 来完全禁用此功能：

```bash
docker run -d --name bitwarden \
  -e SIGNUPS_ALLOWED=false \
  -e INVITATIONS_ALLOWED=false \
  -v /vw-data/:/data/ \
  -p 80:80 \
  vaultwarden/server:latest
```

> 无论如何限制，Vaultwarden 管理员都可以通过 admin page 邀请任何人。

### 限制注册邮箱域名

可以通过相应设置 `SIGNUPS_DOMAINS_WHITELIST` 将注册限制为来自某些域的电子邮件地址。例如：

- `SIGNUPS_DOMAINS_WHITELIST=example.com` (single domain)
- `SIGNUPS_DOMAINS_WHITELIST=example.com,example.net,example.org` (multiple domains)

> [!warning] 如果设置了 `SIGNUPS_DOMAINS_WHITELIST` ，则会忽略 `SIGNUPS_ALLOWED` 的值。

### 开启邮箱验证

设置 `SIGNUPS_VERIFY=true` 可以让新注册用户成功登录之前进行电子邮件验证。这将防止有人使用具有正确域的虚假电子邮件地址进行注册。

### admin page

#### 启用

> 强烈建议在启用此功能之前激活 HTTPS，以避免可能的 MITM 攻击。

该页面允许服务器管理员查看所有注册用户并删除它们。即使注册被禁用，它也允许邀请新用户。

要**启用管理页面**，您需要使用 `ADMIN_TOKEN` 设置身份验证令牌并**将其保密**：

```bash
docker run -d --name vaultwarden \
  -e ADMIN_TOKEN=some_random_token_as_per_above_explanation \
  -v /vw-data/:/data/ \
  -p 80:80 \
  vaultwarden/server:latest
```

令牌可以是任何内容，但建议使用随机生成的长字符串，例如运行 `openssl rand -base64 48` 。

通过 `/admin` 可以进入 admin page。

首次在管理页面中保存设置时，将在 `DATA_FOLDER` 中生成 `config.json` 。**该文件中的值将优先于相应的环境变量**。但请注意，管理页面中的配置更改只有在您单击 `Save` 按钮后才会生效。

> [!warning] 更改 `ADMIN_TOKEN` 后，当前登录的任何管理员仍然可以使用其现有的登录会话，直到过期。管理会话生命周期是可配置的，默认值为 20 分钟。

#### 禁用

如果需要禁用 admin page，需要取消设置 `ADMIN_TOKEN` 并重新启动 Vaultwarden。

但如果环境变量 `ADMIN_TOKEN` 的值保留在上述 `config.json` 文件中，则删除该值不会禁用管理页面。要禁用管理页面，请确保未设置 `ADMIN_TOKEN` 环境变量，并且 `config.json` 中不存在 `"admin_token"` 键（如果该文件存在）。

#### 保护令牌

按照 [官方说明](https://github.com/dani-garcia/vaultwarden/wiki/Enabling-admin-page#secure-the-admin_token)，有两种方式可以生成加密的 Argon2 PHC 字符串，这里我们用 vaultwarden 内置的 PHC 生成器对 `ADMIN_TOKEN` 进行 hash 加密：

```bash
docker exec -it 容器名称 /vaultwarden hash
```

Vaultwarden CLI 将要求输入密码两次，如果两次相同，它将输出生成的 PHC 字符串，如下：

```
ADMIN_TOKEN='$argon2id$****$****$****$****'
```

同样，对于生成的加密字符串，有三种方式可以进行配置：

1. 使用 `docker-compose.yml`，在 `enviroment` 中引入 `ADMIN_TOKEN` 即可：
   ```
   environment:
    ADMIN_TOKEN: $$argon2id$$****$$****$$****$$****
   ```
   > 注意，这里的 Argon2 PHC 跟生成的略有不同，不仅没有引号包裹，且原本的每个 `$` 必须用两个连续的 `$$` 进行转义。
2. 直接在 CLI 中通过 `-e ADMIN_TOKEN` 参数引入。
3. 通过 `.env` 文件：
   ```
    # 在.env文件中如下配置
    VAULTWARDEN_ADMIN_TOKEN='$argon2id$v=19$m=65540,t=3,p=4$MmeK.....'

    # 然后在docker-compose.yml中引入
    environment:
      - ADMIN_TOKEN=${VAULTWARDEN_ADMIN_TOKEN}
    ```
4. 也可以在 `/admin` 界面中进行修改，不过官方似乎不建议这么干。

如果加密字符串不合法，会给出警告：

```
WARNING: The argon2id variable is not set. Defaulting to a blank string.
WARNING: The v variable is not set. Defaulting to a blank string.
WARNING: The m variable is not set. Defaulting to a blank string.
...
```

#### 禁用令牌

将 `DISABLE_ADMIN_TOKEN` 变量设置为 true 可以禁用用于身份验证的内置 `ADMIN_TOKEN` ，同时启用管理面板。任何有权访问该 URL 的人都可以访问管理面板。您将需要采取额外的步骤来保护它。这包括外部和本地。

## 代理设置

官方给出了一些用户的代理 [案例](https://github.com/dani-garcia/vaultwarden/wiki/Proxy-examples)，包括 caddy，nginx 等，这里笔者习惯于 nginx，下面给出自用的配置。

```json
# vaultwarden proxy config
# The `upstream` directives ensure that you have a http/1.1 connection
# This enables the keepalive option and better performance
#
# Define the server IP and ports here.
upstream vaultwarden-default {
  zone vaultwarden-default 64k;
  server 127.0.0.1:9988;
  keepalive 2;
}

# Needed to support websocket connections
# See: https://nginx.org/en/docs/http/websocket.html
# Instead of "close" as stated in the above link we send an empty value.
# Else all keepalive connections will not work.
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      "";
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your_vaultwarden.com;

    if ($host = your_vaultwarden.com) {
        return 301 https://$host$request_uri;
    }
    return 404;
}

server {
    # For older versions of nginx appened http2 to the listen line after ssl and remove `http2 on`
    listen 443 ssl;
    # http2 on;
    server_name your_vaultwarden.com;

    # Specify SSL Config when needed
    ssl_certificate /path/to/your/fullchain.cer;
    ssl_certificate_key /path/to/your/domain.key;
    client_max_body_size 525M;

    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;

      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_pass http://127.0.0.1:9988;
    }
}
```

## 部署容器

这里给出一个自用的 `docker-compose.yml`：

```yaml
version: '3'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    volumes:
      - /deploy/vaultwarden/data:/data
    ports:
      - 9988:80
    environment:
      DOMAIN: "https://your_vaultwarden.com"
      LOG_FILE: "/data/access.log"
      SIGNUPS_ALLOWED: true
      INVITATIONS_ALLOWED: false
      ADMIN_TOKEN: $$...$$...$$....$$...$$...
```

拉取镜像并启动容器：

```bash
# 进入项目根目录
cd /deploy/vaultwarden

# 创建并启动容器
docker-compose up -d
```

## 自动备份

使用脚本对 vaultwarden 数据打包，然后借助阿里云对象存储 CLI 工具 ossutil 上传至对象存储 bucket，将该过程设置定时任务以完成自动备份。

备份脚本 `oss-upload.sh` 如下：

```bash
#!/bin/bash

# 检查是否传入路径参数
if [ $# -eq 0 ]; then
    echo "Error: Please provide a directory path as an argument."
    exit 1
fi

path=$1
echo "target is $path"

# 检查传入的路径是否存在
if [ ! -d $path ]; then
    echo "Error: The specified directory does not exist."
    exit 1
fi

timestamp=$(date +"%Y-%m-%d")

# 创建压缩文件
tar -zcPf "${timestamp}.tar.gz" $path >> output.txt

# 上传压缩文件到oss
ossutil cp -f "${timestamp}.tar.gz" oss://vault-warden/ >> output.txt

# 删除压缩文件
rm "${timestamp}.tar.gz"

echo "Script executed at $(date)" >> output.txt
```

执行完成后，可手动执行进行测试：

```bash
chmod +x oss-upload.sh
./oss-upload.sh /path/to/vault-warden
```

脚本执行后， `output.txt` 中存有过程日志记录，bucket 中会出现 `YYYY-MM-DD.tar.gz` 文件。由于这里是每天备份一次，所以名称精确到天即可，如有进一步需求可自行修改。

设置定时任务方式如下：

```bash
crontab -e
```

在文件中添加一行：

```
0 0 * * * /path/to/oss-upload.sh /path/to/vault-warden
```

保存并退出即可。