---
title: PowerShell Docs
published: 2023-11-29
category: 教程
tags: [windows, shell, script]
# updated: 2024-05-23 14:03:22
# categories: [教程, 软件工程]
---

# PowerShell Docs

### 无法加载文件，因为在此系统上禁止运行脚本

```powershell
get-executionpolicy  # 获取当前执行策略
set-executionpolicy remotesigned  # 设置执行策略
```

> [!info] 执行策略
> `Restricted` 执行策略 (默认设置) 不允许任何脚本运行。  
> `AllSigned` 和 `RemoteSigned` 执行策略可防止 Windows PowerShell 运行没有数字签名的脚本。

### 高级特性

不清楚具体是哪个版本开始，power shell 具有了自动补全的功能，我还以为是 starship 带来的呢 hhhh

在输入重复指令时，可以看见提示信息以灰色字体出现在当前光标后方，按**右箭头**键即可自动补全。

按下 `F2`，可以查看不同完成建议的列表，通过上下箭头选中，回车上屏。

按照 [reddit](https://www.reddit.com/r/PowerShell/comments/ytkqch/ps_suddenly_has_autocomplete_how_to_use_it/?rdt=63286&onetap_auto=true) 的说法，该功能是巨硬合并了 `PSReadline` 模块后带来的。

## 概念

PowerShell 命令称为 cmdlet（读作 command-let）。除了 cmdlet 外，使用 PowerShell 还可以在系统上运行任何可用命令。

PowerShell 使用 **“动词 - 名词”** 名称对来命名 cmdlet。例如，PowerShell 中包含的 `Get-Command` cmdlet 用于获取在命令行界面中注册的所有 cmdlet。谓词标识 cmdlet 执行的操作，名词标识该 cmdlet 执行其操作的所在资源。

### 谓词

谓词是 PowerShell 中的一个重要概念。它是大多数 cmdlet 都遵循的一种命名标准。你在编写自己的命令时，也应遵循此命名标准。其中的思路是，谓词表示你尝试执行的操作，例如读取数据或更改数据。 PowerShell 有一个标准化的谓词列表。要获取所有可用谓词的完整列表，请使用 `Get-Verb` cmdlet：

```
PS F:\> get-verb

Verb      AliasPrefix     Group        Description
----        -----------      -----          -----------
......
......
```

## 环境变量的用法

不同于 Linux 的直接使用 `$key`，powershell 中必须加上 `$env:` 的前缀

```powershell
$env:your_env
```

## Get-Member 发现对象、属性和方法

```powershell
# 获取当前路径下所有vtt字幕文件
$vtts = Get-ChildItem -Path . -Filter "*.vtt"
# 取出其中一个
$vtt = $vtts[0]
# 查看其具有的对象、属性和方法
$vtt | Get-Member
# 只想查看其属性
$vtt | Get-Member -MemberType Properties
```

## Get-Command 查找命令

`Get-Command` cmdlet 将返回系统上安装的所有可用命令的列表，包含四个属性字段

### 根据名称筛选

```powershell
#  查找名为Get-Process的命令
Get-Command -Name Get-Process

# 使用通配符进行模糊查询：查找所有名为 "xxx-Process" 的命令
Get-Command -Name *-Process
```

### 根据名词和谓词进行筛选

```powershell
# 根据谓词筛选：查找名为 "Get-xxx" 的命令
Get-Command -Verb 'Get'

# 根据名词筛选：查找名为 "xxx-Uxxx" 的命令
Get-Command -Noun U*

# 也可以组合参数缩小搜索范围
Get-Command -Verb Get -Noun U*
```

### 使用其他 Cmdlet 筛选结果

`Select-Object ` 此通用命令可帮助你从一个或多个对象中选取特定属性。还可以限制返回的项目数。

```powershell
# 返回当前会话中前 5 个可用命令的 Name 和 Source 属性值
Get-Command | Select-Object -First 5 -Property Name, Source
```

## 文件 IO

### 创建文本文件

```powershell
# 创建
New-Item .\shell_test\text.txt
# 写入
Set-Content .\shell_test\text.txt 'this is a text written by powershell.'
# 读取
Get-Content .\shell_test\text.txt
```

### 清空文件内容

```powershell
Clear-Content .\shell_test\text.txt
```

### 插入文件内容

```powershell
Set-Content .\shell_test\text.txt 'hello'
Add-Content .\shell_test\text.txt 'world'
Get-Content .\shell_test\text.txt
```

结果为

```
hello
world
```

> 看起来是会自动写入换行符

## 文件和文件夹

**New-Item** cmdlet 用于通过使用 `-Path` 作为文件路径和 `-ItemType` 作为文件传递路径来创建文件。

### 创建

**创建文件夹**：在 `F:\` 下创建 `shell_test` 文件夹

```powershell
New-Item -Path 'F:\shell_test' -ItemType Directory
```

**创建文件**：在 `F:\shell_test` 下创建 `test.txt` 文件

```powershell
New-Item -Path 'F:\shell_test\test.txt' -ItemType File
```

### 复制

**Copy-Item** cmdlet 用于通过传递**要复制的目录/文件的路径**和**目标路径**来复制目录。

**复制文件夹**

```powershell
Copy-Item 'F:\shell_test\' 'F:\copy_shell_test'
```

**递归复制**文件夹（包含里面的内容）

```powershell
Copy-Item 'F:\shell_test\' -Recurse 'F:\copy_shell_test'
```

复制指定的内容

```powershell
Copy-Item -Filter *.jpg -Path 'F:\shell_test\' -Recurse 'F:\copy_shell_test'
```

### 删除

**Remove-Item** cmdlet 用于通过传递要删除的目录/文件的路径来删除。

```powershell
# 删除文件
Remove-Item 'F:\shell_test\aa.jpg'
# 删除文件夹
Remove-Item 'F:\shell_test'
```

当删除文件夹不为空时，会提示

```
Confirm
The item at F:\shell_test has children and the Recurse parameter was not specified. If you continue, all children will
be removed with the item. Are you sure you want to continue?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"):
```

因此，可以**递归删除**文件夹

```powershell
# 删除 shell_test 及其目录下所有内容
Remove-Item 'F:\shell_test' -Recurse
# 效果同上
Remove-Item 'F:\shell_test\' -Recurse
# 删除 shell_test 目录下所有内容，但不会删除 shell_test 本身
Remove-Item 'F:\shell_test\*' -Recurse
```

### 移动

**Move-Item** cmdlet 用于通过传递要移动的目录/文件的路径和目标路径来移动目录。

```powershell
# 移动单个文件
Move-Item 'F:\shell_test\2' [-Destination] F:\shell_test\1

# 移动多个文件
Move-Item file1,file2 -Destination /path/to/target
```

注意两个问题：
1. 不涉及复杂参数的情况下，路径参数的引号可以不加
2. `F:\shell_test\2` 路径下的文件也会被移动
3. 移动多个文件时，如果省略 `-Destination`，则最后一个路径默认作为目的地
4. 移动命令没有 `-Recurse` 一说
5. `-Force` 参数可以强制运行命令而不要求用户确认。

### 重命名

**Rename-Item** cmdlet 用于通过传递要重命名的文件 (夹) 的路径和目标名称来重命名文件 (夹)。

```powershell
# 将 1 重命名为 this1
Rename-Item 'F:\shell_test\1' this1
```

需注意，同路径下不可以有同名文件夹，否则会失败。

### 检测是否存在

**Test-Path** cmdlet 用于检查文件 (夹) 是否存在。

```powershell
Test-Path 'F:\shell_test\'
```

结果为

```
1
2
3
4
5
8
```

## Measure-Object

**Measure-Object** cmdlet 可用于获取传递的输出的属性，例如最小值、最大值、大小、计数、行等。

```powershell
# 获取文件属性
Get-Content .\shell_test\text.txt | Measure-Object -line -word -Character
```

结果为（行数、单词数、字符数）

```
Lines Words Characters Property
----- ----- ---------- --------
2       2         10
```

统计目录下文件数量

```powershell
Get-ChildItem .\shell_test\ | Measure-Object
```

表示共有 3 个文件（文件 + 文件夹）

```
Count             : 3
Average           :
Sum               :
Maximum           :
Minimum           :
StandardDeviation :
Property          :
```

也可以如下操作：

```powershell
$zips = Get-ChildItem *.zip
$zips.Count  # 也能直接获取数量
```

## 比较运算符

https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_comparison_operators?view=powershell-7.4

**等式**

- `-eq`、`-ieq`、`-ceq` - 等于
- `-ne`、`-ine`、`-cne` - 不等于
- `-gt`、`-igt`、`-cgt` - 大于
- `-ge`、`-ige`、`-cge` - 大于或等于
- `-lt`、`-ilt`、`-clt` - 小于
- `-le`、`-ile`、`-cle` - 小于或等于

**匹配**

- `-like`、`-ilike`、`-clike` - 字符串匹配通配符模式
- `-notlike`、`-inotlike`、`-cnotlike` - 字符串与通配符模式不匹配
- `-match`、`-imatch`、`-cmatch` - 字符串匹配正则表达式模式
- `-notmatch`、`-inotmatch`、`-cnotmatch` - 字符串与正则表达式模式不匹配

**替代功能**

- `-replace`，`-ireplace`，`-creplace` - 替换与正则表达式模式匹配的字符串

**包含**

- `-contains`、`-icontains`、`-ccontains` - 集合包含值
- `-notcontains`、`-inotcontains`、`-cnotcontains` - 集合不包含值
- `-in` - 值位于集合中
- `-notin` - 值不在集合中

**类型**

- `-is` - 这两个对象的类型相同
- `-isnot` - 对象类型不相同

## Alias

### 内置别名

```powershell
Get-Alias
```

> [!tip] `ls`, `pwd`, `cd` 等指令在 power shell 仍然能够工作，就是得益于内置的 alias

### 为无参 cmdlet 创建 alias

```powershell
# 将Get-AuthenticodeSignature创建别名gas
New-Alias -Name gas -Value Get-AuthenticodeSignature
# 将现有别名重新分配给其他 cmdlet
Set-Alias -Name gas -Value Get-Location
Get-Alias -Name gas

# 只读别名：防止误删除/修改
Set-Alias -Name loc -Value Get-Location -Option ReadOnly

# 创建可执行文件的别名
Set-Alias -Name np -Value C:\Windows\notepad.exe
```

若要更改或删除只读别名，请使用 `Force` 参数。

### 为有参命令创建 alias

**不能**为带有参数和值的命令（例如 `Set-Location -Path C:\Windows\System32`）创建别名。若要为某个命令创建别名，请创建一个包括该命令的函数，然后**为此函数创建别名**。

```powershell
Function CD32 {Set-Location -Path C:\Windows\System32}
Set-Alias -Name Go -Value CD32
```

## 重定向输出

`Out-File` 将 powershell 的输出写入到文件。

```powershell
# 直接写入
Get-Process | Out-File -FilePath .\Process.txt

# 防止覆盖现有文件
Get-Process | Out-File -FilePath .\Process.txt -NoClobber
```

以 ASCII 格式将输出发送到文件：

```powershell
$Procs = Get-Process
Out-File -FilePath .\Process.txt -InputObject $Procs -Encoding ASCII -Width 50
```

- `Encoding` 参数将输出转换为 ASCII 格式
-  `-Width` 参数将文件中的每一行限制为 50 个字符，因此某些数据可能会被截断。

## 关于异常

**终止和非终止错误**：异常通常是终止错误。引发的异常要么被捕获要么会终止当前执行程序。

> 默认情况下，`Write-Error` 会生成一个非终止错误，并将错误添加到输出流，而不引发异常。也就是说，`Write-Error` 和其他非终止错误不会触发 `catch`！

### 创建异常

若要创建自己的异常事件，可以使用 `throw` 关键字引发异常。

```powershell
function Start-Something
{
    throw "Bad thing happened"
}
```

前面提到过，默认情况下 `Write-Error` 不会引发终止错误。但如果指定 `-ErrorAction Stop`，`Write-Error` 将会生成一个可使用 `catch` 处理的终止错误。

```powershell
Write-Error -Message "Houston, we have a problem." -ErrorAction Stop
```

**创建类型异常**

```powershell
throw [System.IO.FileNotFoundException] "Could not find: $path"
```

### try/catch/finally

PowerShell（以及许多其他语言）中的异常处理方式是，先对一部分代码执行 `try`，如果引发**终止错误**，则对其执行 `catch`。可使用 `$_` 变量访问 `catch` 块中的异常信息。

```powershell
try
{
    Start-Something -ErrorAction Stop
}
catch
{
    Write-Output "Something threw an exception or used Write-Error"
    Write-Output $_
}
```

有时不需要处理错误，但无论异常是否发生，仍需要执行一些代码，则使用 `finally`。

### 处理异常

**捕获类型化异常**

```powershell
try
{
    Start-Something -Path $path
}
catch [System.IO.DirectoryNotFoundException],[System.IO.FileNotFoundException]
{
    Write-Output "Could not find $path"
}
catch [System.IO.IOException]
{
        Write-Output "IO error with the file: $path"
}
```

## 脚本模块

将可复用的函数单独封装进 `psm1` 模块文件，然后引用

```powershell
# common.psm1
function do-something {
...
}
```

然后在其他 `ps1` 文件中引入该模块

```powershell
# script.ps1
Import-Module "/path/to/common.psm1" -DisableNameChecking
```

由于自定义函数/模块的名称未必严格符合 powershell 的 `verb` 格式，有时会报 warning，通常加上 `-DisableNameChecking` 忽略即可。

## 输出流

在 PowerShell 中，你可以使用 `Write-Host` 命令输出内容，并且可以通过修改输出的字体颜色和背景色来增加可读性。你可以使用 `-ForegroundColor` 和 `-BackgroundColor` 参数来设置文本的前景色（字体颜色）和背景色。此外，你也可以使用 `\n` 来添加换行符。

```powershell
# 输出红色文本
Write-Host "This is red text" -ForegroundColor Red

# 输出黄色文本，蓝色背景
Write-Host "This is yellow text with blue background" -ForegroundColor Yellow -BackgroundColor Blue

# 输出包含换行符的文本
Write-Host "This is the first line`nThis is the second line"

# 使用变量输出带颜色的文本
$variable = "Important message"
Write-Host "The message is: $variable" -ForegroundColor Green
```

## 函数

**函数参数** 使用 `param()` 声明，可以在声明时指定参数类型。

```powershell
function Validate-Path {
    # 验证输入路径、输出路径和视频文件格式
    param(
        [string]$i,
        [string]$o,
        [string]$f
    )
    ......
}
```

> `$input` 是一个关键字，不可以作为参数使用。

**函数返回值**有多种形式：

1. 返回包含多个值的数组

    ```powershell
    return @($i, $o, $f)
    ```

    返回值的获取

    ```powershell
    $params = func
    Write-Host $params[0]  # 使用索引获取
    ```

2. 返回 `key-value` 形式的哈希表

    ```powershell
    return @{
        key1 = $i
        key2 = $o
        key3 = $f
    }
    ```

    返回值的获取

    ```powershell
    $params = func
    Write-Host $params.key1 # .key获取
    ```

## 执行默认操作

`Invoke-Item` 用于对指定项执行默认操作。例如在**与某一文档文件类型关联的应用程序**中打开该文档文件。

**打开文件**

```powershell
Invoke-Item "C:\Test\a.doc"

# 打开特定类型的所有文件
Invoke-Item "C:\Users\User1\Documents\*.xls"
```

**在文件资源管理器打开当前路径** 

```powershell
Invoke-Item .
```

## 路径拼接

https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.management/join-path?view=powershell-7.4

## 网络

### DNS

可以使用 `Resolve-DnsName` cmdlet 来测试一个 URL 的 DNS 查询记录。

```powershell
Resolve-DnsName example.com [-Type MX] [-Server 8.8.8.8]
```

- 使用 `-Type` 参数指定要查询的 DNS 类型
- 使用 `-Server` 参数指定要使用的 DNS 服务器

```powershell
Get-DnsClientServerAddress
```

这将显示操作系统当前配置的 DNS 服务器地址。通常情况下，你会看到一个或多个 DNS 服务器的 IP 地址。

### 路由表 Route

#### Get-NetRoute

Windows 路由表控制有一个内置命令 `route`，大概率是从 cmd 继承过来的。

```powershell
# 打印路由表
route print

# 添加记录(临时)
route add $DestinationIP mask $SubMask $Gateway
# 删除记录
## 如果目标唯一的话，应该是不需要添加额外参数
route delete $DestinationIP
```

`route print` 打印出的路由表和 powershell `Get-NetRoute` cmdlet 打印的结果稍有不同。如下：

```powershell
route print

IPv4 路由表
===========================================================================
活动路由:
网络目标        网络掩码          网关       接口   跃点数
          0.0.0.0          0.0.0.0   172.26.255.254   172.26.214.232    100
        127.0.0.0        255.0.0.0            在链路上         127.0.0.1    331

# powershell
Get-NetRoute


ifIndex DestinationPrefix                              NextHop                                  RouteMetric ifMetric PolicyStore
------- -----------------                              -------                                  ----------- -------- -----------
19      255.255.255.255/32                             0.0.0.0                                          256 35       ActiveStore
14      255.255.255.255/32                             0.0.0.0                                          256 25       ActiveStore
```

可以看见，主要区别在于 powershell 默认使用了 IP-CIDR 格式，因此相比于 route 命令缺少了子网掩码字段。

#### New-NetRoute

```powershell
# 向路由表添加 IP
New-NetRoute -DestinationPrefix "10.0.0.0/24" -InterfaceIndex 12 -NextHop 192.168.0.1
```

> 注意，不同于 `route add`，`Net-NetRoute` 的子网掩码用 IP-CIDR 格式表示。

| 参数 | 作用 | 默认 |
| ---- | ---- | ---- |
| AddressFamily | `IPv4/IPv6` | 自适应其余参数 |
| Confirm | 执行前确认 | False |
| InterfaceAlias | 网卡名称 | None |
| PolicyStore | `ActiveStore/PersistentStore`|  两个都有|

注意，不声明 PolicyStore 的情况下，会插入**永久路由**！

## 硬件相关

### 磁盘

```powershell
# 常用于查看 MediaType (HDD 还是 SDD)
Get-PhysicalDisk

# 常用语查看盘符和磁盘名称
Get-Volume
```

## 管理服务 Service

### 获取服务

```powershell
Get-Service

Get-Service -Name se*

Get-Service -DisplayName ServiceLayer, Server
```

- 不带参数将返回所有服务（`Status / Name / DisplayName`）
- 可以添加参数（如 `-Name`）进行筛选，支持通配符过滤或提供显示名称的列表

> 服务的 `Name` 和 `DisplayName` 并不总是一致！

有时服务的字段过长，导致终端中的输出被截取，可以通过 `Format-Table` 解决：

```powershell
Get-Service -name razer* | Format-Table -AutoSize
```

### 获取必需和从属服务

```powershell
# 获取 LanmanWorkstation 服务所依赖的服务。
Get-Service -Name LanmanWorkstation -RequiredServices

# 获取需要 LanmanWorkstation 服务的服务。
Get-Service -Name LanmanWorkstation -DependentServices
```

### 停止、启动、暂停和重启服务

```powershell
# 停止服务
Stop-Service -Name spooler
# 启动服务
Start-Service -Name spooler
# 暂停服务
Suspend-Service -Name spooler
# 重启服务
Restart-Service -Name spooler
```

### 设置服务属性

`Set-Service` cmdlet 更改服务的属性，也可以启动、停止或暂停服务。

**更改显示名称**

```powershell
Set-Service -Name LanmanWorkstation -DisplayName "LanMan Workstation"

```

**更改服务的启动类型**

```powershell
Set-Service -Name BITS -StartupType Automatic
```

- Automatic - 服务将由操作系统在系统启动时启动或在系统启动时已启动。 如果自动启动的服务依赖于手动启动的服务，则手动启动的服务也会在系统启动时自动启动。
- AutomaticDelayedStart - 系统启动后不久启（延迟启动）。
- Disabled - 服务被禁用，不能由用户或应用程序启动。
- InvalidValue - 不起作用。 该 cmdlet 不返回错误，但服务的 StartupType 不会更改。
- Manual - 服务只能由用户（使用服务控制管理器）或应用程序手动启动。

**更改服务的说明**

```powershell
# 查看 ipreport 服务当前 Description
Get-Service -Name ipreport | Select-Object Description
# 修改
Set-Service -Name ipreport -Description "ip report to whr"
# 查看修改结果
Get-Service -Name ipreport | Select-Object Description
```

**处理多个服务**

`Set-Service` cmdlet 一次只接受一个服务名称。 但是，可以通过管道将多个服务传递给 `Set-Service`，以更改多个服务的配置。

```powershell
Get-Service SQLWriter,spooler |
    Set-Service -StartupType Automatic -PassThru |
    Select-Object Name, StartType
```

### 删除服务

```powershell
# 移除名为 TestService 的服务
Remove-Service -Name "TestService"

# 移除使用显示名称的服务
Get-Service -DisplayName "Test Service" | Remove-Service
```

使用 `-confirm` 参数可以在运行 cmdlet 之前进行确认。

## 案例

### 如何调用已有脚本实现代码复用？

可以通过循环，在每次迭代中调用脚本。下面是一个示例代码，演示了如何在 PowerShell 中循环调用脚本来处理多个输入文件：

```powershell
# 假设有一个包含多个输入文件的文件夹，路径为 $inputFolder
$inputFolder = "C:\Path\To\Input\Folder"

# 遍历输入文件夹中的所有文件
$inputFiles = Get-ChildItem -Path $inputFolder -File
foreach ($file in $inputFiles) {
    # 构建参数列表
    $params = @{
        inPath = $file.FullName
        outPath = "C:\Path\To\Output\Folder\" + $file.BaseName + "_converted.csv"
        inEncoding = "gb2312"  # 输入文件的编码格式
        outEncoding = "utf8"   # 想要转换成的编码格式
    }

    # 调用脚本并传入参数
    & "C:\Path\To\Your\Script.ps1" @params
}
```
