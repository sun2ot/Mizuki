---
title: 部署subconverter
published: 2023-02-04
description: 如何在Linux上部署subconverter服务，实现自建订阅转换后端，避免订阅链接泄露，同时实现一个订阅，全平台共用的效果。
category: 教程
tags: [software, GFW, clash]
# updated: 2023-03-01 14:32:58
# categories: [教程, 搞机]
---

# 下载 subconverter

```shell
wget https://github.com/tindy2013/subconverter/releases/download/v0.7.2/subconverter_linux64.tar.gz
```

进入根目录后， `pm2 start subconverter` 即可启动

# 使用

随便找个网页前端
[ACL4SSR 在线订阅转换 (acl4ssr-sub.github.io)](https://acl4ssr-sub.github.io/)

>不用前端，直接码链接当然可以。但 subconverter 仅接受 URLEncoded 的链接，因此还是找个前端简单省事。当然，自行部署也没得问题。

![image.png](https://img.085404.xyz/images/811ecf4c8568aafbd64d80250b3b900d.png)

复制生成的链接即可使用

# 进阶操作

## 调用参数

这里介绍了 subconverter 可选的链接参数
[subconverter/README-cn.md at master · tindy2013/subconverter (github.com)](https://github.com/tindy2013/subconverter/blob/master/README-cn.md#%E8%B0%83%E7%94%A8%E8%AF%B4%E6%98%8E-%E8%BF%9B%E9%98%B6)

**参数中几个需要关注的地方**：
- `&clash.dns=1` 时，才可在配置文件中嵌入 dns 信息，详情见配置文件 pref. toml
- `&remove_emoji=false` 可以避免节点前的符号被抹除
- `&filename=xxx` 可以自定义订阅后的配置文件名
- `&config=https://xxx` 或 `&config=config/test.ini` 可以指定远程/本地的配置文件
- `&expand=false` 可以将规则通过 provider 的形式插入配置文件。这点非常重要，因为大的规则集动辄数万条，如果全部写在一个配置文件里很可能会出现缺失，加载也慢

## 全局配置文件 pref.*

加载配置文件时会按照 `pref.toml` 、 `pref.yml` 、 `pref.ini` 的优先级顺序加载优先级高的配置文件（这仨都在根路径下）
[subconverter/README-cn.md at master · tindy2013/subconverter (github.com)](https://github.com/tindy2013/subconverter/blob/master/README-cn.md#%E8%B0%83%E7%94%A8%E8%AF%B4%E6%98%8E-%E8%BF%9B%E9%98%B6)

###  [common] 部分

**文件中几个需要关注的配置**：

#### api_access_token 

参数可设置为自定义的密码，该密码用于**短链接**的鉴权

#### exclude_remarks 

可以**排除部分匹配到的节点**，用于过滤用作提示信息的节点
```
exclude_remarks=(到期|剩余流量|时间|官网|产品|平台)
```

#### default_external_config 

可指定 url 链接中 config 参数为空时的**默认配置文件**
```
default_external_config=config/example_external_config.ini
```

#### proxy_config 

可开启**更新配置文件时使用代理**（否则国内直连 github raw 非常感人）
```
proxy_config=SYSTEM # 使用系统代理
#  或者使用本地的 1080 端口进行 SOCKS5 代理
proxy_config=socks5://127.0.0.1:1080 # 
# 或者使用CORS代理
proxy_config=cors: https://cors-anywhere.herokuapp.com/ 
```

#### 模板文件 base

配置文件中有若干个 `base` 字段，其作用是引用不同平台的**配置模板**。因此，若订阅后生成的配置文件不符合你的需求，请更改 `/base/all_base.tpl` 或自定义配置模板后在 `pref.toml` 中修改模板引用路径

#### enable_insert

可以在输出的订阅中**添加节点**，用于自建或是~~别人共享~~（白嫖）的节点

```
;当enable_insert = true时，会添加insert_url中的所有节点
;如果有多个节点，仍然需要使用 "|" 分隔
;支持 单个节点/订阅链接

[ini]
insert_url=ss://xxxxx|vmess://xxxx

[toml]
insert_url=["ss://xxxxx|vmess://xxxx"]
```

#### 规则配置文件

```ini
[custom]  
;必须以 [custom] 开头，否则引用 pref.toml 中引用的本地规则
;注释以分号引起
;update: 2023-02-04 19:00

ruleset=🎯 全球直连,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/SteamCN.yaml

;引用Clash规则中的classical类型的规则集，并将其指向🎯 全球直连这一策略组
;需注意，在clash配置文件中ruleset分为classical, domain, ipcidr三种类型，其中后两者都可通过clash-domain/clash-ipcidr引用，而前者关键词有所变化 classical -> classic

;也可以引用本地规则文件，ruleset=GroupName,rules/ChinaDomain.list
;注意，subconverter在不声明的条件下，仅支持.list类型文件(在线/本地皆可)

ruleset=🚀 节点选择,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Steam.yaml

ruleset=📺️ 动画疯,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Bahamut.yaml

ruleset=🅱 Bilibili,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/zhihang-yi/ClashRules/main/RuleSet/BilibiliHMT.yaml

ruleset=🚀 节点选择,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/zhihang-yi/ClashRules/main/RuleSet/Weibo.yaml

ruleset=🎯 全球直连,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/zhihang-yi/ClashRules/main/RuleSet/CustomizeDirect.yaml

ruleset=🚀 节点选择,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/zhihang-yi/ClashRules/main/RuleSet/CustomizeProxy.yaml

ruleset=🛑 拦截,clash-classic:https://ghproxy.com/https://raw.githubusercontent.com/zhihang-yi/ClashRules/main/RuleSet/CustomizeReject.yaml

ruleset=🚀 节点选择,clash-domain:https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt

ruleset=🎯 全球直连,clash-domain:https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt

ruleset=🎯 全球直连,clash-domain:https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt

ruleset=🛑 拦截,clash-domain:https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt

ruleset=🐟 漏网之鱼,[]FINAL

;[]FINAL和clash配置文件中的MATCH作用一致，此处也可写为[]MATCH

custom_proxy_group=🚀 节点选择`select`[]DIRECT`.*`http://www.gstatic.com/generate_204`300,5

;策略组节点选择, 类型为select, 引用direct和所有节点. 给定测速链接,每隔300秒测速一次,5秒后判定为timeout

custom_proxy_group=🎯 全球直连`select`[]DIRECT`[]🚀 节点选择

custom_proxy_group=🛑 拦截`select`[]REJECT`[]DIRECT

custom_proxy_group=📺️ 动画疯`select`(🇹🇼|台)`

;注意, proxy_group=GroupName`select`[]DIRECT    ✅最后一个分量不以`结尾
;proxy_group=GroupName`select`(港|台)               ❌筛选规则需要以`完整包裹

custom_proxy_group=🅱 Bilibili`select`[]DIRECT`(🇭🇰|港|🇲🇴|澳门|🇹🇼|台)

custom_proxy_group=🐟 漏网之鱼`select`[]🚀 节点选择`[]🎯 全球直连

enable_rule_generator=true

overwrite_original_rules=true
```

分组配置文件中各个字段通过 $`$ 隔开

```ini
# 各字段按顺序分别为
custom_proxy_group=Group_Name`url-test|fallback|load-balance`Rule_1`Rule_2`...`test_url`interval[,timeout][,tolerance]
custom_proxy_group=Group_Name`select`Rule_1`Rule_2`...

# 格式示例
custom_proxy_group=🍎 苹果服务`url-test`(美国|US)`http://www.gstatic.com/generate_204`300,5,100
# 表示创建一个叫 🍎 苹果服务 的 url-test 策略组,并向其中添加名字含'美国','US'的节点，每隔300秒测试一次，测速超时为5s，切换节点的延迟容差为100ms

custom_proxy_group=🇯🇵 日本延迟最低`url-test`(日|JP)`http://www.gstatic.com/generate_204`300,5
# 表示创建一个叫 🇯🇵 日本延迟最低 的 url-test 策略组,并向其中添加名字含'日','JP'的节点，每隔300秒测试一次，测速超时为5s

custom_proxy_group=负载均衡`load-balance`.*`http://www.gstatic.com/generate_204`300,,100
# 表示创建一个叫 负载均衡 的 load-balance 策略组,并向其中添加所有的节点，每隔300秒测试一次，切换节点的延迟容差为100ms

custom_proxy_group=🇯🇵 JP`select`沪日`日本`[]🇯🇵 日本延迟最低
# 表示创建一个叫 🇯🇵 JP 的 select 策略组,并向其中**依次**添加名字含'沪日','日本'的节点，以及引用上述所创建的 🇯🇵 日本延迟最低 策略组

custom_proxy_group=节点选择`select`(^(?!.*(美国|日本)).*)
# 表示创建一个叫 节点选择 的 select 策略组,并向其中**依次**添加名字不包含'美国'或'日本'的节点
```

# FAQ

## 移动端 Clash 的配置文件栏不显示流量信息

解决方法：为订阅转换域名配置 SSL 证书

> ~~经测试，x-ui 脚本通过 acme 申请的泛域名证书，在（国产）安卓手机上是不被信任的~~，因此订阅时 Clash 会提示 x509 错误。建议通过阿里云等国内平台申请单域名的 SSL 证书

> 2023-05-15 修正：
> 通过 acme 申请的证书，不是不被信任，而是要使用 `fullchain.cer` 与 `域名.key` ，不要使用 `域名.cer`

