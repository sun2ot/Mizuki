---
title: LaTeX 使用教程
published: 2025-07-01
category: 教程
# updated: 2025-07-01 11:27:28
# categories: [教程, 科研]
---

## LaTex 发行版部署 (Windows)

下载 [texlive](https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/Images/) 并装载。装载 ISO 完成后，执行批处理文件安装。

![image.png](https://img.085404.xyz/images/2d24ff911eb9c033c47be6ee8983aeaf.webp)

---
考虑到一些人可能对 ISO 文件没有概念，这里详细说一下具体的操作流程。**如果你能顺利的完成上一步骤，分割线内的操作可以略过。**

点击上面的下载地址，选择下载最新的（你看到的时候不一定是 2024 了）`texlive$year.iso` 文件即可。

![image.png](https://img.085404.xyz/images/a2c6cbf12a79abfe0c67610ce831f668.webp)

找到下载的文件，鼠标右键，找到 `装载` 选项，点击它，完成后你会发现有一个新的 DVD 驱动器装载到了你的电脑（如下图）。ISO 文件是一种光盘镜像文件，常用于存储光盘的内容，如 CD 或 DVD 的数据，这里你可以理解为 `texlive` 的安装包通过一个虚拟的 U 盘插在了你的电脑上，现在你只需要进去找到安装文件执行就 OK 了。

![image.png](https://img.085404.xyz/images/90d870bcc90c110b8792962882f4aeea.webp)

右键这个驱动器，打开它，你就可以成功找到 [文章开头](#LaTex%20发行版部署%20(Windows)) 提到的**批处理安装文件**。
> 或者你直接双击上方图片的这个驱动器也行，会自动弹出安装界面的，all right？

---

可**酌情**修改安装位置。

![image.png](https://img.085404.xyz/images/e74aa2342795b7004fb7ed383fffceb2.webp)

注意，他的修改很有意思，子路径是分割开的进行设置的，所以一般只需要修改盘符即可。

![image.png](https://img.085404.xyz/images/c2d7139b9fad54a0d0282043be7169f0.webp)

点击 `Advanced` 进入高级设置菜单，这里还可以设置一些东西。

![image.png](https://img.085404.xyz/images/b73ca149f7a21781528a1ff76552052f.webp)

首先是语言。通常情况下中文 + 英文即可。在 `Customize` 菜单中，勾选 “`Chinese`”、“C `hinese/Japanese/Korean (base)`”，再往下拉，勾选 “`US and UK English`”，然后点击 “`确定`”。

准备就绪后，点击右下角“安装”。

![image.png](https://img.085404.xyz/images/583214f8169e8daa80978b5a6a60b28d.webp)

> 安装过程涉及大量 4K 小文件读写，硬盘拉跨可能会很慢，请耐心等待。

### 补充说明

在 Linux 上部署 Texlive 的方式和 Windows 基本一致，只不过界面换成了 Terminal。此外，Linux 上需要额外下载 `ghostscript`，否则 eps 转 pdf 时会失败：

```bash
sudo apt update
sudo apt install ghostscript
```

## vscode 配置

首先声明，在 texlive 安装完成后，默认会自带一个编辑器 `TeXworks editor`，是可以正常使用的。但谁能拒绝宇宙第一开源编辑器 vscode 呢🤣。

只需要安装插件 `LaTex Workshop` 即可让 vscode 支持 LaTeX 编辑。此外，还需要添加如下配置文件。

> 注意，该配置仅需工作区生效即可。
> 
> 如果不清楚 vscode 的分区管理，那就在项目根目录下新建一个 `.vscode/settings.json`，然后将下面配置复制粘贴进去即可。

```json
{
    //输出文件的保存目录(会自动在当前路径下创建build文件夹)
    "latex-workshop.latex.outDir": "%DIR%/build",
    //光标在公式上时会自动悬浮渲染
    "latex-workshop.mathpreviewpanel.cursor.enabled": true,
    //使用默认的(第一个)编译链自动构建 LaTeX 项目
    "latex-workshop.latex.autoBuild.run": "onSave",
    "latex-workshop.showContextMenu": true,
    //从使用的宏包中自动提取命令和环境，补全正在编写的代码
    "latex-workshop.intellisense.package.enabled": true,
    //文档编译错误时是否弹出显示出错和警告的弹窗(都可从终端获取)
    "latex-workshop.message.error.show": false,
    "latex-workshop.message.warning.show": false,
    //定义编译工具
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "--output-directory=%OUTDIR%",
                "%DOCFILE%" //%DOC%
            ]
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "--output-directory=%OUTDIR%",
                "%DOCFILE%"
            ]
        },
        {
            "name": "latexmk",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-pdf",
                "-outdir=%OUTDIR%",
                "%DOCFILE%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": [
                "build/%DOCFILE%"
            ]
        }
    ],
    //定义编译链
    "latex-workshop.latex.recipes": [
        {
            "name": "XeLaTeX",
            "tools": [
                "xelatex"
            ]
        },
        {
            "name": "PDFLaTeX",
            "tools": [
                "pdflatex"
            ]
        },
        {
            "name": "BibTeX",
            "tools": [
                "bibtex"
            ]
        },
        {
            "name": "LaTeXmk",
            "tools": [
                "latexmk"
            ]
        },
        {
            "name": "xelatex -> bibtex -> xelatex*2",
            "tools": [
                "xelatex",
                "bibtex",
                "xelatex",
                "xelatex"
            ]
        },
        {
            "name": "pdflatex -> bibtex -> pdflatex*2",
            "tools": [
                "pdflatex",
                "bibtex",
                "pdflatex",
                "pdflatex"
            ]
        },
    ],
    //编译完成后要清除掉的辅助文件类型(如无需求，请勿修改)
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux",
        "*.bbl",
        "*.blg",
        "*.idx",
        "*.ind",
        "*.lof",
        "*.lot",
        "*.out",
        "*.toc",
        "*.acn",
        "*.acr",
        "*.alg",
        "*.glg",
        "*.glo",
        "*.gls",
        "*.ist",
        "*.fls",
        "*.log",
        "*.fdb_latexmk"
    ],
    //何时对上文设置的辅助文件进行清除
    "latex-workshop.latex.autoClean.run": "onFailed",
    //设置默认编译链
    "latex-workshop.latex.recipe.default": "pdflatex -> bibtex -> pdflatex*2",
    //反向同步快捷键绑定
    "latex-workshop.view.pdf.internal.synctex.keybinding": "double-click",

    "[latex]": {
        "editor.wordWrap": "on",  //自动换行
        "editor.wordWrapColumn": 80
    },
}
```

理论上说，安装过程中会自动配置环境变量，从而让 `xelatex` 等命令全局生效。但如果编译时一直检测不到，可以换成绝对路径引用，或者尝试**重启电脑**。

**看不懂上面的内容就看这里**。你要做的是三件事：
1. 下载安装 vscode
2. 下载一个叫做 `LaTex Workshop` 的插件，图标是一个钢笔一样的东西
3. 在 vscode 中打开你的 LaTeX 模板文件夹
4. 在这个文件夹的根目录下，新建一个文件夹 `.vscode`，然后在 `.vscode` 文件夹里再新建一个 `settings.json` 文件
5. 把上面的配置文件内容复制粘贴到 `settings.json`，保存
6. 你的 vscode 右侧会多出一个 LaTeX 的操作面板，点进去试吧
7. **还有任何不会用的就百度去**，只要你投的不是什么十分野鸡的期刊，网上很容易就能找到 LaTeX 模板的使用方法

### LaTex Workshop 占位符说明

参考 https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile#placeholders

首先在配置项 `outDir` 中指定全局输出路径，这里 ` %DIR ` 指工作区根路径：

```json
"latex-workshop.latex.outDir": "%DIR%/build",
```

> 注意编译前请提前创建好对应路径 `build/`

然后，在各编译器中，即可使用占位符 `%OUTDIR%` 表示输出路径。

> 参考官方文档：“`%OUTDIR%` is the output directory configured in [`latex-workshop.latex.outDir`](https://github.com/James-Yu/LaTeX-Workshop/wiki/View#latex-workshoplatexoutdir)”

以 `xelatex` 编译器为例，可以看见其输出参数为 `-output-directory`：

```
xelatex -help

-output-directory=DIR   use existing DIR as the directory to write files in
```

因此配置编译工具 `latex-workshop.latex.tools`：

```json
// 使用占位符 %OUTDIR%
{
    "name": "xelatex",
    "command": "xelatex",
    "args": [
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "--output-directory=%OUTDIR%",
        "%DOCFILE%"
    ]
}
```

类似的，为 `latexmk` 添加参数：

```json
{
    "name": "latexmk",
    "command": "latexmk",
    "args": [
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "-pdf",
        "-outdir=%OUTDIR%",
        "%DOCFILE%"
    ]
}
```

但注意，`bibtex` 没有该参数，直接通过 `bibtex xxx` 进行编译，因此修改为:

```json
{
    "name": "bibtex",
    "command": "bibtex",
    "args": [
        "build/%DOCFILE%"
    ]
}
```

> [!caution] 
> 注意这里 bibtex 的配置，需指定参数为 `build/` 而不是用占位符 `%OUTDIR%` 代替，这是由于 LaTeX 的安全考虑，可参考如下链接：
> -  [解决问题：bibtex.exe: Not writing to xxx/xxx.blg](https://blog.csdn.net/weixin_43959160/article/details/139213483)
> -  [bibtex error: Not writing to book.blg (openout_any = p)](https://tex.stackexchange.com/questions/223870/bibtex-error-not-writing-to-book-blg-openout-any-p-mactex-2014)

## 中文支持

参考 [overleaf latex Chinese](https://cn.overleaf.com/learn/latex/Chinese)

推荐使用 XeLaTeX 和 LuaLaTeX 来编译含有中文字符的 `.tex` 文件：
1. 直接使用 `ctexart` 文档类即可支持中文
2. 或者使用 `ctex` 包来支持中文

```latex
\documentclass{ctexart}

\begin{document}
\tableofcontents

\begin{abstract}
这是简介及摘要。
\end{abstract}

\section{前言}

\section{关于数学部分}
数学、中英文皆可以混排。You can intersperse math, Chinese and English (Latin script) without adding extra environments.

這是繁體中文。
\end{document}
```

或者

```latex
\documentclass{xxx}
\usepackage{ctex}
```

## LaTex 语法

[点击跳转](https://blog.085404.xyz/method/latex-grammar.html)

## 参考

- [shinyypig/latex-vscode-config](https://github.com/shinyypig/latex-vscode-config)
- [blog.iw17.cc/install-latex](https://blog.iw17.cc/install-latex/)
- [blog.iw17.cc/vscode-latex](https://blog.iw17.cc/vscode-latex/)
- [知乎：Visual Studio Code (vscode)配置LaTeX](https://zhuanlan.zhihu.com/p/166523064)
