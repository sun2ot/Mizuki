---
title: PDF书签目录自动生成
published: 2023-03-19
category: 教程
tags: [software, bookmark, auto, Python]
# updated: 2024-01-04 21:21:55
# categories: [教程, 搞机]
---

# Notice

1. 本文针对图片型 pdf 无效
2. 需要 [Python](https://www.python.org/) 环境
3. 本文默认操作系统为 Windows
4. 生成的目录只能精确到页，无法精确到文本锚点
>也就是说如果你的标题在一页末尾，只能跳转到所在页的开头，你得滑动页面找到它；如果你的多个标题在同一页，点击目录都只会跳转到该页的开头

---

# 一、准备

## 安装 Python

你当然可以选择下载 anaconda 或 miniconda 之类的集成环境，这里由于笔者不是专业 Python 人员，因此选择直接下载基础环境。

安装完成后，打开命令行，输入

```py
python
```

出现版本信息并进入 Python 交互页面即可

```
D:\另存>python
Python 3.10.6 (tags/v3.10.6:9c7b4bd, Aug  1 2022, 21:53:49) [MSC v.1932 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

>Tips：退出 Python 时，可通过 `ctrl + z` + `enter` 或者 `exit()` 或者 `quit()` 退出

---

## 下载 pdf. tocgen 工具集

[Krasjet/pdf.tocgen (github.com)](https://github.com/Krasjet/pdf.tocgen)

```powershell
pip install -U --user pdf.tocgen
```

`pdf.tocgen` 共包含以下三个部分：

1.  `pdfxmeta` : extract the metadata (font attributes, positions) of headings to build a **recipe** file.
2.  `pdftocgen` : generate a table of contents (ToC) from the recipe.
3.  `pdftocio` : import the table of contents to the PDF document.

**官方介绍**

> [pdf.tocgen](https://krasjet.com/voice/pdf.tocgen/) is a set of command-line tools for automatically extracting and generating the table of contents (ToC) of a PDF file. It uses the embedded font attributes and position of headings to deduce the basic outline of a PDF file.    --from GitHub

简单地说，`pdf.tocgen` 是一个 Python 工具集。因为 PDF 本身其实是没有标题一说的，全部的排版格式都是通过矢量进行定位，你眼中的标题在 PDF 看来无非就是字体更粗、更大、独占一行的文本罢了。

而 `pdf.tocgen` 正是利用这种特性，可以根据提取出的“标题”字符特征，推断出全文中其他相同格式的文本，从而形成大纲（outline），最后再嵌入 PDF 文件即可。

---

# 二、生成 PDF 目录

## 官方工作流程详解

[pdf.tocgen (krasjet.com)](https://krasjet.com/voice/pdf.tocgen/#a-worked-example)

>`pdfxmeta/pdftocgen/pdftocio -h` 即可查看指令文档

---

## 提取标题文本特征（pdfxmeta）

>Windows 环境下请使用 cmd，或者你所安装的 Python 集成环境的命令行工具，不要用 powershell......

### 命令格式

```cmd
pdfxmeta -p 页码 -a 标题级别 文件名.pdf "标题文本" [>> recipe.toml]
```

- `-p` ：1, 2, 3，...... 页码
- `-a` ：标题级别，一级标题为 1，二级标题为 2，......
- `"标题文本"` ：能够**筛选出**标题的文本
>一些标题中可能包含特殊字符，如 emojy、空格等，这在 cmd 中也许不能被有效识别（即**执行 pdfxmeta 后输出结果为空**），因此可以选用标题中所包含的部分字符进行筛选。
>
>当然，你也可以使用**正则表达式**（需为 Python 所支持的）
- `>> recipe.toml` ：可选。加上该指令可以让标题特征直接输出到 `recipe.toml` 文件。注意，此处的文件名不一定要是 `recipe`，可以是任何值。以下为介绍方便，统一为 `recipe.toml`。

根据 pdf 文件中的标题所在位置，**反复执行上述指令**，生成最终的标题特征文件。

### 案例

```py
>>>pdfxmeta -p 1 -a 2 作文模板.pdf "第一段" >> recipe.toml

// 输出

[[heading]] 
# 第一段
level = 2
greedy = true
font.name = "MicrosoftYaHei-Bold"
font.size = 15.75732135772705
# font.size_tolerance = 1e-5
# font.color = 0x3ababa
# font.superscript = false
# font.italic = false
# font.serif = false
# font.monospace = false
# font.bold = true
# bbox.left = 67.04096221923828
# bbox.top = 130.88217163085938
# bbox.right = 113.84020233154297
# bbox.bottom = 151.6790771484375
# bbox.tolerance = 1e-5
```

>如果你没有使用 `>> recipe.toml`，请在 **PDF 文件所在目录下**，新建一个 `recipe.toml` 并将输出结果复制粘贴到其中并保存文件。


## 生成 ToC 文件 （pdftocgen）

### 命令格式

```cmd
pdftocgen [-H] 文件名.pdf < recipe.toml [> toc.txt]
```

- `-H` ：可选。作用是打印出更易读（对人类而言）的目录，但该目录无法被 `pdftocio` 读取，即**不可用于生成 PDF 目录**
- `> toc.txt` ：可选。作用是将生成的目录结果直接导出到 `toc.txt` 文件，因此你当然可以选择不加该指令，然后手动新建一个文件并将结果复制粘贴到其中。与 `recipe.toml` 相同，此处的文件名不唯一，你可以任意选用。但以下为描述方便，统一为 `toc.txt`
>其实 `.txt` 也是可以不加的，此处的文件只要可读就行了，因此 `> toc` 同样可行。但 txt 总归更容易双击打开，不是吗？

> [!bug] The '<' operator is reserved for future use.

报错是因为 `<` 在 powershell 中属于保留字之类的？总之是运行不了，要么在 cmd 离运行（如上），要么用 powershell 的 cmdlet 和管道符完成：

```powershell
Get-Content recipe.toml | pdftocgen -H [> toc.txt]
```


### 案例

```powershell
pdftocgen 作文模板.pdf < recipe.toml > toc.txt

# 输出

"一、大作文" 1
    "1. 第一段" 1
    "2. 第二段" 1
    "3. 第三段" 2
    "4. 关键词" 2
"二、小作文" 4
    "2.1 建议信" 4
    "2.2 投诉信" 5
    "2.3 感谢信" 6
    "2.4 道歉信" 7
    "2.5 邀请信" 8
    "2.6 通知" 9
    "2.7 接收 / 拒绝  邀请" 9
    "2.8 推荐信" 10
    "2.9 求职 / 辞职信" 12
    "2.10 请求信" 13
```

如果你使用了 `-H` 生成目录，则结果如下

```powershell
pdftocgen -H 作文模板.pdf < recipe.toml
一、大作文 ··· 1
    1. 第一段 ··· 1
    2. 第二段 ··· 1
    3. 第三段 ··· 2
    4. 关键词 ··· 2
二、小作文 ··· 4
    2.1 建议信 ··· 4
    2.2 投诉信 ··· 5
    2.3 感谢信 ··· 6
    2.4 道歉信 ··· 7
    2.5 邀请信 ··· 8
    2.6 通知 ··· 9
    2.7 接收 / 拒绝  邀请 ··· 9
    2.8 推荐信 ··· 10
    2.9 求职 / 辞职信 ··· 12
    2.10 请求信 ··· 13
```

>再次声明，`-H` 生成的目录仅适用于您不想将目录导入 PDF 的情况

---

## 将 ToC 导入 PDF（pdftocio）

### 命令格式

执行下述指令前，可以手动编辑 `toc.txt`，排查其中的错误，或者删除不想生成书签的内容。

```powershell
# cmd
pdftocio [-o 输出文件名.pdf] 文件名.pdf < toc.txt
# powershell
get-content toc.txt | pdftocio [-o 输出文件名.pdf] 文件名.pdf
```

- `-o 输出文件名.pdf` ：可选。如果需要导入目录后的 PDF 文件名与原来的不相同即可使用。

如果不想生成上述步骤中的目录配方文件（`recipe.toml`），你甚至可以一步到位, 将 `pdftocgen` 的输出结果通过管道直接导入 `pdftocio`

```powershell
# cmd
pdftocgen 文件名.pdf < recipe.toml | pdftocio 文件名.pdf
# powershell (也许可行，没试过)
get-content recipe.toml | pdftocgen 文件名.pdf | pdftocio 文件名.pdf
```

`pdftocio` 也可用来输出 PDF 文档的现有目录

```powershell
pdftocio 文件名.pdf

"一、大作文" 1
    "1. 第一段" 1
    "2. 第二段" 1
    "3. 第三段" 2
    "4. 关键词" 2
"二、小作文" 4
    "2.1 建议信" 4
    "2.2 投诉信" 5
    "2.3 感谢信" 6
    "2.4 道歉信" 7
    "2.5 邀请信" 8
    "2.6 通知" 9
    "2.7 接收 / 拒绝  邀请" 9
    "2.8 推荐信" 10
    "2.9 求职 / 辞职信" 12
    "2.10 请求信" 13
```

或者利用 `-H` 输出

```powershell
pdftocio -H out.pdf

一、大作文 ··· 1
    1. 第一段 ··· 1
    2. 第二段 ··· 1
    3. 第三段 ··· 2
    4. 关键词 ··· 2
二、小作文 ··· 4
    2.1 建议信 ··· 4
    2.2 投诉信 ··· 5
    2.3 感谢信 ··· 6
    2.4 道歉信 ··· 7
    2.5 邀请信 ··· 8
    2.6 通知 ··· 9
    2.7 接收 / 拒绝  邀请 ··· 9
    2.8 推荐信 ··· 10
    2.9 求职 / 辞职信 ··· 12
    2.10 请求信 ··· 13
```
