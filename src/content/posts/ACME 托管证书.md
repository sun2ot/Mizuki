---
title: ACME 托管证书
published: 2023-07-19
category: 教程
tags: [云计算]
# updated: 2024-08-02 20:09:48
# categories: [教程, 搞机]
---

# ACME 托管证书

## 安装 acme. sh

```bash
curl https://get.acme.sh | sh -s email=my@example.com
```

acme. sh 将被安装到 `~/.acme.sh/` 路径下，且**安装过程不会污染已有的系统任何功能和文件**，所有的修改都限制在安装目录中。

## 生成证书

> 这里只推荐通过 DNS API 进行生成

下面以腾讯云 DNSPod 为例，其他的如阿里云、cloudflare 等，参见 [wiki 说明](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

```bash
export DP_Id="123456"

export DP_Key="asdf123456"

# 这里是申请泛域名，也可以根据实际需求申请单域名
./acme.sh --issue --dns dns_dp -d "your-domain.com" -d "*.your-domain.com"
```

剩下的就不用操心了， `acme.sh` 会帮我们搞定。最后，会输出证书相关文件所处的路径，按需使用即可。

```
[Wed 19 Jul 2023 07:03:27 AM EDT] Your cert is in: /root/.acme.sh/your-domain.com_ecc/your-domain.com.cer
[Wed 19 Jul 2023 07:03:27 AM EDT] Your cert key is in: /root/.acme.sh/your-domain.com_ecc/your-domain.com.key
[Wed 19 Jul 2023 07:03:27 AM EDT] The intermediate CA cert is in: /root/.acme.sh/your-domain.com_ecc/ca.cer
[Wed 19 Jul 2023 07:03:27 AM EDT] And the full chain certs is there: /root/.acme.sh/your-domain.com_ecc/fullchain.cer
```

## 查看已安装证书

```
acme.sh --info -d example.com
```

## 更新 acme. sh

目前由于 acme 协议和 letsencrypt CA 都在频繁的更新, 因此 acme. sh 也经常更新以保持同步.

升级 acme.sh 到最新版 :

```
acme.sh --upgrade
```

如果你不想手动升级，可以开启自动升级:

```
acme.sh --upgrade --auto-upgrade
```

之后, acme. sh 就会自动保持更新了。

你也可以随时关闭自动更新:

```
acme.sh --upgrade --auto-upgrade  0
```

## 手动更新证书

先更新一次 acme 脚本

```bash
acme.sh --upgrade
```

然后更新证书

```bash
acme.sh --renew -d 域名
```

也可以一次性更新所有证书

```bash
acme.sh --renew-all
```

如果证书没有过期，需要强制更新，使用 `--force`

```bash
acme.sh --renew -d 域名 --force
```

> [!warning] 
> acme 更新后，别忘了更新 cdn 的证书。

如果发现证书已经更新了，但网页访问仍然提示过期，不妨重启 nginx 试试。

## 自定义脚本

有时我们希望在 `acme.sh` 更新证书后，执行一些新的操作，例如部署或是上传证书。

这可以在 `--reloadcmd` 参数中指定：

```bash
acme.sh --issue -d example.com --dns dns_cf --reloadcmd "/path/to/your_custom_script.sh"
```

如果你已经配置了 `acme.sh` 来自动更新证书，也可以直接编辑 `~/.acme.sh/` 目录下的配置文件 `account.conf`，在文件末尾添加如下内容：

```
Le_ReloadCmd="/path/to/your_custom_script.sh"
```

这样，在每次更新证书完成后时，`acme.sh` 都会自动执行你指定的脚本。

> 请确保自定义的脚本具有执行权限，并且可以正确处理所需的操作。

