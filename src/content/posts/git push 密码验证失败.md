---
title: git push 密码验证失败
published: 2024-03-10
category: 教程
tags: [git]
# updated: 2024-05-30 15:59:15
# categories: [教程, 软件工程]
---

# git push 密码验证失败

## 原因

通过 `git push` 提交时可能会碰到如下错误。字面意思很清楚，密码验证的方法已经在 2021 年 8 月 13 号后就失效了，因此我们需要改用 token 鉴权。

```bash
git push

# 输出
Username for 'https://github.com': sun2ot
Password for 'https://sun2ot@github.com':
remote: Support for password authentication was removed on August 13, 2021.
remote: Please see https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
fatal: Authentication failed for 'https://github.com/sun2ot/xxx.git/'
```

## 解决方案

### 方式一：使用 token

github 头像下拉菜单——settings——新页面左侧导航栏最后一项 developer settings

personal access token——Tokens (classic)
> 经典模式的 token 可以设置**永不过期**，用起来比较方便，当然，被盗了就很不安全，所以自行取舍。

生成的 token 作用范围勾选 `repo` 就足够了，你也可以全勾上，当做万能 token。

然后进入项目根目录

```bash
git remote set-url origin https://<your token>@github.com/<your name>/<repo>.git
```

以后就可以直接 `git push` 了。

### 方式二：使用 ssh

> 使用该方法的前提是已经配置了 GitHub ssh 密钥！

```bash
# 查看远程地址别名及路径
git remote -v

origin  https://github.com/kkeeliu/doubao_community_frontend.git (fetch)
origin  https://github.com/kkeeliu/doubao_community_frontend.git (push)

# 修改远程地址
git remote set-url origin git@github.com:<your name>/<repo>.git

# 查看修改是否成功
git remote -v
```