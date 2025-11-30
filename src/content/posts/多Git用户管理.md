---
title: 多Git用户管理
published: 2025-06-18
category: 教程
# updated: 2025-06-19 10:58:38
# categories: [教程, 软件工程]
---

## 需求背景

当用户具有多个 Git 账户时，就会出现 Git 权限的冲突问题。例如 A 账户无法向 B 账户下的仓库提交 commit。为此，可以通过多密钥的方式来解决。

## 操作步骤

首先为不同的账户创建密钥：

```bash
ssh-keygen -t ed25519 -C "sun2ot" -f ~/.ssh/id_ed25519_sun2ot
```

这里的 `-C` 用于在密钥中插入注释，用于区分不同的密钥。`-f` 指定了你要文件的名称和路径。

类似的，可以用 `-C "Account of B"` 来创建其他账户的密钥。

然后，在 `~/.ssh/config` 中添加对应的 SSH 配置：

```yaml
Host github-sun2ot
  Hostname ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519_sun2ot
```

这里的 `IdentityFile` 注意要设置成私钥（即不带 `.pub` 后缀）。此外，SSH 的默认端口本来是 22，但有的时候由于代理或者防火墙等原因，实测换成 https 的 443 端口会更好。

`Host` 字段用于区分不同的配置名称，可以设置成任意你觉得便于记忆的样式。

设置完成后，即可进行 Git 仓库的配置：

```bash
# 原始
git remote add origin git@github.com:sun2ot/AAA.git
# 修改
git remote add origin git@github-sun2ot:sun2ot/AAA.git
```

对于默认的 Git SSH 配置，`@` 后的域名是 github.com。但这里为了启用我们自定义的 SSH 配置，所以修改为了 `~/.ssh/config` 中对应的 Host 字段。

## 注意事项

请检查你的家目录下是否存在 `.gitconfig`（好像是叫这个，我记不太清了）文件。该文件会在你执行 `git config --global user.name "sun2ot"` 等类似的全局操作后产生。

如果存在全局配置文件，则会覆盖你在仓库路径下设置的局部配置。从而产生无论你怎么修改提交的用户，你会发现始终是一个用户（全局用户）提交的。你可以直接删除这个文件，或者从中删除对应的鉴权信息即可。