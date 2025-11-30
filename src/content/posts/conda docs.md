---
title: conda docs
published: 2023-08-29
category: 教程
tags: [Python, 深度学习, env]
# updated: 2024-06-01 17:03:21
# categories: [教程, 软件工程]
---

# conda docs

## 部署 conda

[Linux conda 部署教程](https://blog.085404.xyz/method/linux-conda-deploy.html)

## 初始化 Windows 命令行的 conda 环境

> 推荐直接使用 `Anaconda Powershell Prompt` ，无需下列操作

如果想在 `powershell/bash/...` 等 shell 中使用 `conda` ，需要进行初始化

```shell
conda init [your shell]
```

> [!tip] 
> 在 Windows 平台中，执行上述操作后，会导致 powershell 启动速度缓慢。可通过 `conda init --reverse` 撤销上述操作。

---

### 两种更优解

`2024-01-02` 找到两种激活 powershell 下 conda 环境的更优解。

#### 默认启动 conda 环境

先找到 Anaconda 安装后自带的 Anaconda Powershell Prompt，右键属性，复制出其中的命令如下

```
%windir%\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy ByPass -NoExit -Command "& 'F:\env\anaconda3\shell\condabin\conda-hook.ps1' ; conda activate 'F:\env\anaconda3' "
```

这段指令干了三件事：
1. 调用系统的 Windows Powershell 修改了脚本执行权限
2. 执行 conda 的 hook 脚本
3. 激活 base 环境

显然，这个过程可以得到精简：
1. 脚本执行权限完全可以持久化，无需每次执行
2. 使用更优的 Powershell 取代 Windows Powershell
3. 无需默认激活 base 环境

基于此，可以得到新的指令如下：

```
"C:\Program Files\PowerShell\7\pwsh.exe" -NoExit -Command "& 'F:\env\anaconda3\shell\condabin\conda-hook.ps1'"
```

将其添加到 Windows Terminal 即可。

#### 按需手动激活 conda 环境

根据上文可吃 conda 的 hook 是通过 `F:\env\anaconda3\shell\condabin\conda-hook.ps1` 完成的，因此给该脚本指定一个 alias，需要时调用即可。打开 powershell 的 `$profile`，添加如下内容即可。

```powershell
New-Alias -Name chook -Value "F:\env\anaconda3\shell\condabin\conda-hook.ps1"
```

## 生成 conda 默认配置文件

```bash
conda config --write-default
```

这将在你的用户根目录下生成一个名为 `.condarc` 的文件，其中包含 conda 的默认配置选项。

## 修改 conda 配置路径

先看看当前的配置路径：

```bash
conda config --show
```

复制其中的 `envs_dirs` 和 `pkgs_dirs` 两段配置，然后编辑 `~/.condarc` 文件：

```yaml
envs_dirs:
  # 这里是新增的路径
  - D:\pkgs\anaconda3\envs
  # 下面是原来的路径，粘贴过来
  - F:\env\anaconda3\envs
  - C:\Users\y2pub\.conda\envs
  - C:\Users\y2pub\AppData\Local\conda\conda\envs
pkgs_dirs:
  # 这里是新增的路径
  - D:\pkgs\anaconda3\pkgs
 # 下面是原来的路径，粘贴过来
  - F:\env\anaconda3\pkgs
  - C:\Users\y2pub\.conda\pkgs
  - C:\Users\y2pub\AppData\Local\conda\conda\pkgs
```

重启 shell，执行 `conda config --show` 查看修改结果。

## 修改镜像

### 配置清华源

先执行

```bash
conda config --set show_channel_urls yes
```

然后编辑用户路径下的 `.condarc` ，复制以下内容并覆盖

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  deepmodeling: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/
```

即可添加 Anaconda Python 免费仓库。

运行 `conda clean -i` 清除索引缓存，保证用的是镜像站提供的索引。

### 查找配置文件的位置

```
conda config --show-sources
```

### 恢复默认源

要恢复 Conda 到默认下载源，你可以简单地移除或重置之前设置的频道配置。以下是两种方法：

1. **移除渠道配置**：
   
   你可以通过删除之前设置的频道配置来恢复默认下载源。使用以下命令：

   ```bash
   conda config --remove-key channels
   ```

   这将删除所有之前设置的频道配置，使 Conda 回到默认状态，使用默认的 Conda 频道源。

2. **重置渠道配置**：

   另一种方法是重置频道配置为默认值。你可以使用以下命令：

   ```bash
   conda config --remove-key channel_alias
   conda config --remove-key channel_priority
   ```

   这将删除之前设置的频道优先级和频道别名配置，并将它们恢复为默认值。默认情况下，Conda 使用官方的 Conda 频道源。

使用以上任一方法都可以将 Conda 恢复到默认下载源。这样，在执行 `conda install` 或其他 Conda 命令时，Conda 将使用默认的下载源来获取软件包。

## 常用指令

| 指令                                 | 作用                 |
| ---------------------------------- | ------------------ |
| `conda env list`                   | 列出所有的 conda 环境路径   |
| `conda info`                       | 列出当前 conda 环境的配置信息 |
| `conda create -n [env_name]`       | 创建环境               |
| `conda activate [env_name]`        | 激活指定环境             |
| `conda deactivate [env_name]`      | 退出指定环境，回到 `base`   |
| `conda remove -n [env_name] --all` | 删除环境               |
| `conda remove/uninstall [pkg]`     | 删除包                |
| `conda env remove -n [env_name]`   | 删除环境               |

`conda env remove -n <环境名称>` 和 `conda remove --name <环境名称> --all` 都用于从 Conda 中删除环境，但它们之间有一些区别：

1. 命令的语法不同：
   - `conda env remove -n <环境名称>` 是一种删除环境的方式，其中 `-n` 用于指定要删除的环境的名称。
   - `conda remove --name <环境名称> --all` 是另一种删除环境的方式，其中 `--name` 用于指定要删除的环境的名称，而 `--all` 用于删除环境中的所有包和依赖项。

2. `conda env remove` 更直观：
   - `conda env remove` 命令的语法更直观，因为它专门用于删除环境。这使得它更容易理解和记忆。

3. `conda remove` 的灵活性：
   - `conda remove` 命令不仅可用于删除整个环境，还可用于删除环境中的特定包。如果您只想删除环境中的某个包，您可以使用 `conda remove --name <环境名称> <包名称>` 命令。

综上所述，选择使用哪个命令取决于您的需求。如果您只需要删除整个环境，那么 `conda env remove` 可能更直观。如果您需要更多的灵活性，包括删除特定包，那么 `conda remove` 可能更适合。

## 指定路径创建 conda 环境

```bash
conda create --prefix=D:\Conda\文件夹名称 python=3.8
```

## 没有名字的 env 如何启动

```bash
conda env list
# conda environments:
#
base                  *  D:\env\anaconda3
                         D:\env\conda\envs\learn-torch
```

此时可以通过路径激活 conda 环境

```bash
codna activate D:\env\conda\envs\learn-torch
```

### 为什么会出现这种情况？

不推荐使用直接修改 `~/.condarc` 的方式来修改 conda 的默认路径，因为有权限的限制，或者别的什么原因，导致你的修改可能并不会起作用。

```bash
❯ conda config --show envs_dirs
envs_dirs:
  - C:\Users\Administrator\.conda\envs
  - D:\env\anaconda3\envs
  - C:\Users\Administrator\AppData\Local\conda\conda\envs
```

可以看见， `D:\env\conda\envs\` 这个路径并不在 `envs_dirs` 里面，也就是我们建立的**环境目录没有加进来**。因此，执行下面命令手动添加

```bash
conda config --append envs_dirs D:\env\conda\envs 
```

再次执行 `conda config --show envs_dirs` ，可以看见该路径已经成功添加。

接下来同步修改一下 `pkgs` 的路径，毕竟这玩意才是硬盘占用大头

```bash
conda config --add pkgs_dirs D:\env\conda\pkgs
```

> 已经 `create` 的 env 是（~~没法~~？）修改的，所以建议直接 remove，或者直接新建，这样新产生的 conda 环境就会在我们指定的路径下。

## 如何以指定的 conda 环境运行代码

这是我作为初学者冒出的一个问题。后来想明白了发现，这其实是并没有理解 conda 作用的情况下才会提出的。

你的代码相当于一块蛋糕，你准备使用不同的 conda 环境去运行，其实就等价于用不同的餐具吃蛋糕：

1. 蛋糕不会因为你使用不同的餐具导致其形状、位置发生变化（**你的代码始终在计算机硬盘里某个地方放着，不会被移动、修改**）
2. 你想用什么餐具去吃，就用手拿什么餐具（ `conda activate <your_env>` ）

所以，激活对应的 conda 环境后，该怎么执行代码就怎么执行，不需要移动代码到 conda 所在位置或者别的什么操作。

## 如何在某个 conda 环境下添加新包

下载

```bash
conda install <pkgs>=<version>
```

查看当前 conda 环境有哪些包

```bash
conda list
```

## 修改已建立的 conda 环境的 Python 版本

```bash
conda activate <env_name>
conda uninstall python
conda install python=x.x
```

## 重置 conda 环境

查看历史，按需选择 REV_NUM 数值。一般情况下，0 表示是第一次安装，包括 root 环境和 conda 命令，所以一般为 1 或之后。

```bash
conda list --revisions

conda install --revision [revision number]
```

## 通过文件形式下载依赖

例如 `requirement.txt`

```txt
scikit-learn==1.1.3 
scipy==1.10.1 
seqeval==1.2.2
transformers==4.27.4
pytorch-crf==0.7.2
```

通过如下指令下载

```bash
conda install --file requirement.txt
```

> 在 conda 环境中， `<pkg>==<version>` 和 `<pkg>=<version>` 之间通常没有区别。两者都表示要安装指定版本的包。

## conda 环境下通过 pip 安装的包在哪里？

Windows：

```
<anaconda安装路径>\envs\<环境名称>\Lib\site-packages\
```

## 去除 conda 前的 (base) 标识

```bash
# 取消
conda config --set changeps1 false
# 激活
conda config --set changeps1 true
```

## conda 路径异常

默认情况下，conda 会安装在 `/home/user` 下，如果迁移，可能会导致一系列异常。

此时，需要修改：

```bash
vim miniconda3/bin/conda
```

> 没错，conda 是一个文本文件，而不是二进制

```bash
#!/home/yzh/yzh/miniconda3/bin/python
# -*- coding: utf-8 -*-
import sys
# Before any more imports, leave cwd out of sys.path for internal 'conda shell.*' commands.
# see https://github.com/conda/conda/issues/6549
if len(sys.argv) > 1 and sys.argv[1].startswith('shell.') and sys.path and sys.path[0] == '':
    # The standard first entry in sys.path is an empty string,
    # and os.path.abspath('') expands to os.getcwd().
    del sys.path[0]

if __name__ == '__main__':
    from conda.cli import main
    sys.exit(main())
```

修改第一行 `#!` 后的执行文件路径，为迁移之后的 `miniconda3` 路径。

## 复制一个 conda 环境

请养成良好的习惯，编写代码时记录下 `requirements.txt`！
请养成良好的习惯，编写代码时记录下 `requirements.txt`！
请养成良好的习惯，编写代码时记录下 `requirements.txt`！

> conda 确实可以 clone 一个环境，但这不是写代码不写依赖和 README.md 的理由，all right？

如果是用户自己克隆自己的某个环境，很简单：

```bash
conda create --name <创建的环境名> --clone <要克隆的环境名>
```

如果是一个用户，克隆另一个用户的环境，直接给 `--clone` 传入环境敏感参数是不可行的，因为不同用户之间并不可见。因此，可以采取如下两种方式：

1. 通过环境配置复刻一个环境。
   
    首先，让原环境的所有者导出其环境的配置文件：

   ```bash
    conda env export > environment.yml
    ```

    这将会创建一个名为 `environment.yml` 的文件，其中包含了环境中的所有包及其版本信息。将其分享给另一个用户，即可凭此创建一个具有相同配置的新环境：
    
   ```bash
   conda env create -f environment.yml
   ```
    
    新环境的名字默认是文件中指定的名字，如果没有指定则需要手动命名。

2. 直接访问源环境克隆。
   
    如果知道另一个用户的环境路径，**并且对该路径拥有读取权限**，理论上可以直接克隆：
   
    ```bash
    conda create --clone /path/to/original/env --name new_env_name
    ```
