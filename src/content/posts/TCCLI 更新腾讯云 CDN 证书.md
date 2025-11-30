---
title: TCCLI更新腾讯云CDN证书
published: 2024-05-03
category: 教程
tags: [云计算, ssl, cdn, TencentCloud]
# updated: 2024-06-28 14:33:07
# categories: [教程, 搞机]
---

# TCCLI 更新腾讯云 CDN 证书

## 背景

经查，由于上游服务商相关政策，针对免费 ssl 的有效时间从 1 年缩减至了 90 天，国内腾讯云及阿里云等平台均受影响。

如此一来，这些云服务大厂的免费证书按照麻烦程度真的不如 [acme.sh](https://github.com/acmesh-official/acme.sh) 签 90 天的泛域名了。不过不知道处于什么原因，腾讯跟阿里都是有云计算平台的 CLI 工具的，但搜索了一圈发现只有阿里云平台的第三方教程，而腾讯云的大多是调用的 web api，所以这里就自己折腾一下吧。

> 官方的文档只能当手册看，拿来当教程用略有些折磨。

## 安装 TCCLI

> 以下内容节选自官方文档，由于文档链接可能会变动，这里就不放了，反正它们钱多，搜索引擎排名向来都是“名列前茅”的，所以随便搜一搜就有了。

`TCCLI` 没有独立的二进制文件，需要一来 Python 环境，所以安装也是依靠 pip 进行：

```bash
pip install tccli
```

查看是否安装成功：

```bash
tccli --version

3.0.1099.1
```

在 Linux 环境下执行以下命令可开启自动补全功能，支持大小写自动纠错：

```bash
complete -C 'tccli_completer' tccli
```

> 将其写入 `.bashrc/.zshrc` 可持久化生效。

## 配置 TCCLI

通过交互模式进行配置：

```bash
tccli configure
```

由于安全原因，不建议为腾讯云主账户设置 API Token，通常是建立子用户来设置权限，使用子用户的 `secrectKey/Id` 进行操作。因此，这里**建议使用 TCCLI 的多账户模式**：

```bash
tccli configure --profile any_name_you_like
```

后续使用 `tccli` 指令时，在最后加上 `--profile any_name_you_like` 即可使用对应的账户配置。

## 上传证书

```bash
tccli ssl UploadCertificate --cli-unfold-argument --CertificatePublicKey '-----BEGIN CERTIFICATE-----
***
-----END CERTIFICATE-----' --CertificatePrivateKey '-----BEGIN EC PRIVATE KEY-----
***
-----END EC PRIVATE KEY-----' --Alias 'acme-085404.xyz'
```

| 参数                    | 必填  | 类型     | 描述                           |
| --------------------- | --- | ------ | ---------------------------- |
| CertificatePublicKey  | 是   | String | 证书内容                         |
| CertificatePrivateKey | 否   | String | 私钥内容，证书类型为 SVR 时必填，为 CA 时可不填 |
| Alias                 | 否   | String | 备注                           |

响应结果：

```json
{ 
    "Response": {
        "CertificateId": "***", 
        "RepeatCertId": "", 
        "RequestId": "***" 
    }
}
```

这里的 `CertificateId` 就是腾讯云控制台的证书 id。

## 更新 CDN 证书

```bash
tccli cdn UpdateDomainConfig --cli-unfold-argument --Domain 'blog.085404.xyz' --Origin.AdvanceHttps.CertInfo.CertId LE-dsfdsf --Origin.AdvanceHttps.CertInfo.Certificate '不展示' --Origin.AdvanceHttps.CertInfo.PrivateKey '不展示' --Origin.AdvanceHttps.CertInfo.Message '备注' --Origin.AdvanceHttps.CertInfo.From 'acme.sh-upload'
```

```bash
#!/bin/bash

tccli cdn ModifyDomainConfig --cli-unfold-argument --Domain 'blog.085404.xyz' --Route 'Https.CertInfo.CertId' --Value '{\"update\":\"0VpOXiPz\"}'

echo "cdn证书更新脚本执行完成"
```

## 脚本示例

使用下述脚本前，先执行 `sudo apt install jq`，需要 `jq` 这个库来解析命令行输出的 json 数据。

> 你用 `sed` 当然也行

```bash
#!/bin/bash

# 读取acme.sh证书，并上传腾讯云，返回证书id

# 从文件中读取文本内容并存储到变量中
SSLPub=$(cat "/root/.acme.sh/085404.xyz_ecc/fullchain.cer")
SSLPri=$(cat "/root/.acme.sh/085404.xyz_ecc/085404.xyz.key")

response=$(tccli ssl UploadCertificate --cli-unfold-argument --CertificatePublicKey "$SSLPub" --CertificatePrivateKey "$SSLPri" --Alias "acme-085404.xyz" --profile obsidian)

echo $response

CertificatedId=$(echo $response | jq -r '.CertificateId')

echo "cerd id: $CertificatedId"
cert_id='{"update":"'$CertificatedId'"}'

tccli cdn ModifyDomainConfig --cli-unfold-argument --Domain 'your_cdn_domain.com' --Route 'Https.CertInfo.CertId' --Value "$cert_id" --profile obsidian
```