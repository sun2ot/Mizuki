---
title: LaTex 语法
published: 2024-11-06
category: 教程
tags: [科研]
---
> [!tip]
> 如果你有过 markdown 的写作经历，上手 LaTeX 会特别快

## 基础说明

LaTeX 的写作本质上是一种**非所见即所得的标签化的**语言。所有在 Word/WPS 中需要通过鼠标键盘控制样式的部分，只需要通过对应的标签即可控制。

但是，LaTeX 是编辑部用来最终排版的，因此 LaTeX 的 bst 和 cls 文件就控制了整个文档的样式。也就是说，只需要用标签进行样式控制，但不需要对具体的细节进行排版（行高、字体等等）。这些样式也都是编辑部给的模板写死的，**严禁修改**。部分期刊会对修改了样式的稿件**直接退稿**，认定为学术不端。

下面会对各种常见的样式进行说明。其实相应的介绍，期刊/会议提供的模板中通常会有一个 PDF 文件，那里面也会详细介绍各种样式的使用说明。不过大体上是类似的，只是不同期刊的部分样式略有不同。

## 标题

```latex
\section{一级标题}
\subsection{二级标题}
\subsubsection{三级标题}
```

## 换行

LaTeX 不比 markdown，切记不要随便空行：
1. 文字与公式之间。空行会导致默认创建一个新段落
2. 文字与图片之间，空行不影响段落间距

如果想在编辑器中换行但又不影响渲染效果，有以下几种方式：
1. 借助编辑器插件设置自动换行
2. 在行尾添加 `%`，这样即使源码中换行也会被忽略

## 列表

与 markdown 和 Word 类似，LaTeX 的列表也有无序列表和有序列表之分。例如引言中，总结本文的主要贡献时，会使用无序列表：

```latex
The main contributions of this work are summarized as follows:
\begin{itemize}
  \item We propose a ...
  \item We design a .
  \item Extensive experiments ...
\end{itemize}
```

无序列表的样式类似于：
- We propose a ...
- We design a .
- Extensive experiments ...

第二种是有序列表，用的相对较少：

```latex
From Tab.1, we can draw some conclusion:
\begin{enumerate}
  \item Text1
  \item Text2
  \item Text3
\end{enumerate}
```

显示的效果类似于：
1. Text1
2. Text2
3. Text3

不同的期刊对于有序列表的样式控制可能有所不同，主要是前面的序号，可能是 `1.`，也可能是 `1)`，或者类似的。因此**请参考模板中提供的 PDF 说明文件**！

## 图片

在 LaTeX 中，有几种不同的方式可以插入图像，包括单栏图像、跨两栏图像以及子图等。

### 单栏图像

单栏图像 `figure` 是最基本的插入图像的方式：

```latex
\begin{figure}[ht]
    \centering  % 控制图片居中
    % []表示参数, width定义了图片的宽度. \textwidth 表示使用单栏的宽度, 0.8 就是这个宽度的 80%
    % {}表示要插入的图像文件
    \includegraphics[width=0.8\textwidth]{image-file.pdf}
    % 图像标题, 注意对于图片来说, 标题在下方, 所以相应的 LaTeX 代码也要写在下面
    \caption{Caption for the figure.} % 根据不同的期刊要求, 决定句末是否要加句点
    \label{fig:label}  % 定义标签, 用于交叉引用. 如果不需要也可以不写
\end{figure}
```

### 双栏图像

对于双栏文档，可以使用 `figure*` 环境来让图像跨越两栏：

```latex
\begin{figure*}[ht]
    \centering
    % 对于两栏而言, \textwidth 自动会变成两栏的宽度. 所以与单栏同理，可以通过 0.8\textwidth 来自定义宽度
    \includegraphics[width=\textwidth]{image-file}
    \caption{Caption for the wide figure.}
    \label{fig:wide-label}
\end{figure*}
```

### 子图

如果你想在一个图中包含多个子图，可以使用 `subfigure` 环境（需要 `subcaption` 包或 `subfig` 包）。
> 不同期刊用的包不太一样，注意看一下

使用 `subcaption` 包的例子如下：

```latex
% 所有的 \usepackage 都在 tex 文档的顶部
% 你也可以自行添加其他的包
% 与软件开发的依赖做区分，Latex 的所有包在你安装的时候就部署好了
% 所以基本都是通用的，不用担心你有但编辑部没有
\usepackage{subcaption}
...
\begin{figure}[ht]
    \centering
    \begin{subfigure}[b]{0.45\textwidth}
        \includegraphics[width=\textwidth]{image-file1}
        \caption{Caption of sub-figure 1.}  % 子图标题
        \label{fig:sub1}
    \end{subfigure}
    \hfill % 填充子图之间的空隙, 可以视情况添加
    \begin{subfigure}[b]{0.45\textwidth}
        \includegraphics[width=\textwidth]{image-file2}
        \caption{Caption of sub-figure 2.}  % 子图标题
        \label{fig:sub2}
    \end{subfigure}
    \caption{Overall caption for both sub-figures.}  % 若干个子图的总标题
    \label{fig:both}
\end{figure}
```

这里演示的是一栏两个子图的情况，所以假设栏宽为 1，就控制每个子图的宽度是 0.45，这样加起来是 0.9 < 1。同理，如果一栏有三个子图，就设置为 0.3。

许注意，**不是说加起来小于 1 就一定可以**。因为图片本身存在一些不可见的边距，也是要占据宽度的。所以假如一栏三个图，你设置宽度 0.33，那大概率是会被挤下来的。

如果你一栏需要更多的图，就继续添加 `\begin{subfigure} ... \end{subfigure}` 就好了。

## 表格

### 基本表格（三线表）

> [!tip]
> 这里我只对基础表格进行一个比较详细的介绍，后面的都可以参照基础表格进行理解。不然太多了，写的累 😅。

```latex
\begin{table}[ht]
    \centering
    % 与图片类似，表格的标题因为在上方，所以\caption要写在上面
    \caption{基本表格示例}
    \label{tab:basic}
    \begin{tabular}{|c|c|c|}
        \toprule
        列1 & 列2 & 列3 \\
        \midrule
        数据1 & 数据2 & 数据3 \\
        数据4 & 数据5 & 数据6 \\
        \bottomrule
    \end{tabular}
\end{table}
```

这个表格渲染的效果类似于：

| 列 1   | 列 2   | 列 3   |
| ------ | ------ | ------ |
| 数据 1 | 数据 2 | 数据 3 |
| 数据 4 | 数据 5 | 数据 6 |

首先看到 `\begin{tabular}` 后面的几个 c：
1. 这里的 c 表示 center，即居中。类似地，左对齐用 l (left)，右对齐用 r (right)
2. 表格一共有 3 列，所以有 3 个 c
3. 每个 c 的左右都有一个 `|`，这个表示表格竖向的分割线。换言之，如果写成 `c c c`，就是**三线表**了

其次，三线表是一个统称。有时并不是真的只有三条线。控制这些横向的线，靠的是三个 `*rule`：
1. `\toprule` 表示最上方的横线
2. `\midrule` 表示表格中间的横线，视情况可以有多条
3. `\bottomrule` 表示最下方的线
4. 请不要随意使用 `\hrule`，这玩意生成的线看起来和三线表一样，但是会缺少三线表上下粗、中间细的特点

然后来看分隔符：
1. `&` 用于区分两个列。如果某一列的值为空，保持空值即可。
2. `\\` 表示表格换行

最后，也是最重要的一点。LaTeX 的表格代码编写（阅读）方式是**逐行进行**的。切记是逐行的，理解这一点，多行/多列表格就很简单了。

### 浮动表格（跨栏）

与图片类似，单栏的基本表格是 `table`，跨栏的就是 `table*`。其余的跟单栏表格一致，不做赘述。

```latex
\begin{table*}[ht]
    \centering
    \caption{跨两栏表格示例}
    \label{tab:twocolumn}
    \begin{tabular}{|c|c|c|}
        \hline
        列1 & 列2 & 列3 \\
        \hline
        数据1 & 数据2 & 数据3 \\
        数据4 & 数据5 & 数据6 \\
        \hline
    \end{tabular}
\end{table*}
```

### 跨行/跨列表格

跨行/跨列指的是类似于 Excel 中的合并单元格操作。LaTeX 中也有对应的控制方法。这里直接上一个复杂表格，一次性讲清这个问题。

```latex
\begin{table}[htb]
\caption{Statistics of benchmark datasets}
\label{tab:dataset}
  \begin{tabular}{cccccccc}
    \toprule
    Dateset & \multicolumn{2}{c}{Yelp} & \multicolumn{2}{c}{Sports} & \multicolumn{3}{c}{Tiktok} \\
    \midrule
    Modality & V & T & V & T & V & T & A \\
    Dim & 512 & 1024 & 4096 & 1024 & 128 & 768 & 128 \\
    \cmidrule(lr){2-3} \cmidrule(lr){4-5} \cmidrule(lr){6-8}
    Users & \multicolumn{2}{c}{37,397} & \multicolumn{2}{c}{35,598} & \multicolumn{3}{c}{9,308} \\
    Items & \multicolumn{2}{c}{32,491} & \multicolumn{2}{c}{18,357} & \multicolumn{3}{c}{6,710} \\
    Interactions & \multicolumn{2}{c}{235,735} & \multicolumn{2}{c}{296,337} & \multicolumn{3}{c}{68,722} \\
    \midrule
    Sparsity & \multicolumn{2}{c}{99.98\%} & \multicolumn{2}{c}{99.95\%} & \multicolumn{3}{c}{99.89\%} \\
    \bottomrule
  \end{tabular}
\end{table}
```

表格渲染效果如下：
![image.png](https://img.085404.xyz/images/528378dbbca9bec72bfa93e9dca9b859.webp)

首先注意，表格第一行乍一看只有 4 列，但是每个数据集本质上占据了 2-3 列，所以 `\begin{tabular}` 后面要列出最多的列数，即 8 个 c。

然后，一个数据集占据了 2-3 列，这个就叫跨列，通过 `\multicolumn{列数}{c/l/r => 居中/左/右}{列名}`。之前说的逐行阅读就是这个原因，跨列的元素是在一行的编辑中完成的。

类似地，如果是跨行的表格，使用 `\multirow{行数}{*}{列名}`：
> [!warning]
> 跨行需要添加包 `\usepackage{multirow}`

```latex
\begin{table*}[t]
\centering
\caption{Overall performance comparison}
\label{tab:performance-comparison}
% \resizebox{\textwidth}{!}{
  \begin{tabular}{lcccccccccc}
  \toprule
  \multirow{2}{*}{Method} & \multirow{2}{*}{Venue} & \multicolumn{3}{c}{Yelp} & \multicolumn{3}{c}{Sports} & \multicolumn{3}{c}{Tiktok} \\
  \cmidrule(lr){3-5} \cmidrule(lr){6-8} \cmidrule(lr){9-11}
   & & R@20 & N@20 & P@20 & R@20 & N@20 & P@20 & R@20 & N@20 & P@20 \\
  \midrule
  LightGCN & SIGIR'20 & 0.0599 & 0.0255 & 0.0040
                      & 0.0754 & 0.0335 & 0.0040
                      & 0.0821 & 0.0369 & 0.0041 \\
```

![image.png](https://img.085404.xyz/images/6799875a7cc6974f926433bd13df6c3e.webp)

参考上图，`Method` 占据了 1-2 行，所以是 `\multirow{2}{*}{Method}`。需要注意，中间的 `*` 最好不要改，它可以自动调整。

在编写时可以看到，Method 和 Venue 虽然占据了两行，但是我们在第一行就写了，因此第二行的对应位置需要空出来 `空白 & 空白 & R@20 & ...`

### 缩放表格

这是一个很有用的包。有时表格过大会导致即使跨栏分布，表格也摆不下。这个使用可以使用 `\resizebox` 根据页面大小自动缩放表格。使用方式如下：

> [!warning]
> 使用 `\resizebox` 需要添加包 `\usepackage{graphicx}`。

```latex
\usepackage{graphicx}

\begin{table}[ht]
    \centering
    \resizebox{\textwidth}{!}{
        % 在原本的 tabular 外面包一层 resizebox 即可
        \begin{tabular}{|c|c|c|c|c|}
            \hline
            列1 & 列2 & 列3 & 列4 & 列5 \\
            \hline
            数据1 & 数据2 & 数据3 & 数据4 & 数据5 \\
            数据6 & 数据7 & 数据8 & 数据9 & 数据10 \\
            % 更多行...
            \hline
        \end{tabular}
    }
    \caption{使用 resizebox 缩小的表格示例}
    \label{tab:resized_table}
\end{table}
```

resizebox 接受的参数是 `\resizebox{宽度}{高度}{内容}`，其中内容指的是表格。而宽度和高度的设置通常如上表所示，我们只需要设置宽度为页面宽度 `\textwidth`，高度设置为 `!`，LaTeX 就能帮我们自动调整表格大小。

## 浮动参数

在上文中，可以经常看到在图表后面有 `[ht]` 这样的标记。这在 LaTeX 中被称为“浮动参数”，它们用于指定浮动体（如图像、表格等）在文档中的**理想放置位置**。这些参数通常紧跟在浮动环境的开始标签（`\begin{figure}` 和 `\begin{table}` 等）之后。

> [!warning]
> 浮动参数只能指定**理想位置**，这就是本文开头我所说的，LaTeX 是一种非所见即所得的排版方式。也许你想让某个表格在当前页的顶部，但由于位置不够，它就可能会被挤到下一页的顶部。

下面对每一种浮动参数进行解释：
- h：代表 "here"，即尽量将浮动体放置在其出现的文本位置附近。
- t：代表 "top"，表示可以放置在页面的顶部。
- b：代表 "bottom"，意味着可以放在页面的底部。
- p：表示可以单独放在浮动体页上，即该页只包含浮动体。
- !：这个符号意味着 LaTeX 应尽可能地遵循上述位置指示，而不是优先考虑其默认的排版规则。

你可以**组合使用这些字母来提供多个位置选项**给 LaTeX。例如，`[ht]` 表示首先尝试在当前位置 (h) 插入浮动体，如果不行，则尝试在页面顶部 (t)。

> [!tip]
> 在 LaTeX 中，图表的位置需要结合浮动参数进行**反复尝试、反复调整**

## 交叉引用（非参考文献）

这里的交叉引用指的是图、表、章节标题之类的交叉引用。之所以单独写一节，是因为所有的引用方式都是一样的。

在上面的 [图片](#图片)、[表格](#表格) 章节中，可以看到在 `\caption{}` 的旁边有一个 `\label{}`，它能够生成一个标记。

你可以在 tex 文档的任意地方对这个标记进行引用 `\ref{}`，就可以生成一个可跳转的标记。引用方式如下：

```latex
% 假设你插入了一张图
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.8\textwidth]{image-file.pdf}
    \caption{Caption for the figure.}
    \label{fig:framework}
\end{figure}
% 中间可能有一堆内容
Fig.\ref{fig:framework} shows that the modal can effectively learn node features.
```

LaTeX 会自动对所有的图表编号，所以上面的内容会直接编译为 `Fig.1` 类似的。

表格的交叉引用和图片是一模一样的。而对于章节，只需要在 `\section{}` 的旁边也通过 `\label{}` 创建一个标签即可引用，方法和图表也是完全一样的。

> [!tip]
> 1. label 的名称没有统一格式，你可以任意设置，但最好具有一定的规律。
> 2. 不要把 label 设置为 fig1, fig2 这种。你能确保 fig1 就永远是第一张图吗？直接以图表的含义作为名称即可。

## 公式

首先说明，LaTeX 的公式说简单也简单，说复杂也复杂（但其实真的很简单）。这里我只写怎么进行排版，具体的公式应该怎么写，建议自学一下。

关于有一些符号如何输出，给你们提供一个很方便的工具文档 [KaTex](https://katex.org/docs/supported.html)。基本上所有的符号都可以从上面找到。

此外，如果你此前是用的 mathtype 写的公式，是可以无缝衔接到 LaTeX 的。只需要改一下设置，让 mathtype 复制的内容变为 LaTeX 即可。自行百度一下。

### 单行公式

先来说单行公式 `equation`，这个是最简单的：

```latex
\begin{equation}
    \mathbf{W}_\text{g} & = \sigma(\mathbf{W}_1\mathbf{P}_m + \mathbf{b}_1)
\end{equation}
```

$$ \mathbf{W}_\text{g} = \sigma(\mathbf{W}_1\mathbf{P}_m + \mathbf{b}_1) \tag{1}$$

和图表一致，LaTeX 会自动对公式进行编号。

### 多行公式

如果需要多行公式，通常建议使用 `align`。使用两个 `equation` 会让行间距变的很大。

```latex
\begin{align}
  \omega_m &= \text{Softmax}(\mathbf{W}_m) \\
  \bar{\mathbf{E}} &= \sum_{m \in \mathcal{M}} \omega_m \cdot \hat{\mathbf{E}}^m
\end{align}
```

$$
\begin{align}
  \omega_m &= \text{Softmax}(\mathbf{W}_m) \tag{1} \\
  \bar{\mathbf{E}} &= \sum_{m \in \mathcal{M}} \omega_m \cdot \hat{\mathbf{E}}^m \tag{2}
\end{align}
$$

多行公式也会自动编号。若干个公式之间通过 `\\` 进行换行。可以在公式中添加符号 `&`，这可以指定每一行的公式应该在什么地方对齐。例如上面的例子是在等号 `=` 处对齐，你也可以放在开头进行左对齐：

```latex
\begin{align}
  & \omega_m = \text{Softmax}(\mathbf{W}_m) \\
  & \bar{\mathbf{E}} = \sum_{m \in \mathcal{M}} \omega_m \cdot \hat{\mathbf{E}}^m
\end{align}
```

$$
\begin{align}
  &\omega_m = \text{Softmax}(\mathbf{W}_m) \tag{1} \\
  & \bar{\mathbf{E}} = \sum_{m \in \mathcal{M}} \omega_m \cdot \hat{\mathbf{E}}^m \tag{2}
\end{align}
$$

### 多行公式特例

有时你可能希望多个公式在一起，但是又不要对它们进行多个编号（例如三个公式共用一个编号），那么可以使用 `split` 环境：

```latex
\begin{equation}
  \begin{split}
    \mathbf{H} &= (1+\delta) \cdot (\mathbf{A}_m + \mathbf{I}) \bar{\mathbf{E}} \\
    &= (1+\delta) \cdot \mathbf{G}_m \bar{\mathbf{E}}
  \end{split}
\end{equation}
```

$$
\begin{equation}
  \begin{split}
    \mathbf{H} &= (1+\delta) \cdot (\mathbf{A}_m + \mathbf{I}) \bar{\mathbf{E}} \\
    &= (1+\delta) \cdot \mathbf{G}_m \bar{\mathbf{E}}
  \end{split}
  \tag{1}
\end{equation}
$$

这种多行公式排版方式**和普通的多行公式完全一致**，例如 `\\` 和 `&` 的使用，只不过是包裹了一个 `split` 环境而已。同样支持自动编号

### 公式引用

公式的引用和上一节的 [交叉引用](#交叉引用-非参考文献) 完全一致。只需要添加一个 `\label{}` 在 `\ref{}` 即可：

```latex
\begin{equation}
    \label{eq:a_eq}
    \mathbf{W}_\text{g} & = \sigma(\mathbf{W}_1\mathbf{P}_m + \mathbf{b}_1)
\end{equation}
% 正文
Eq.\ref{eq:a_eq} is the formulation that ...
```
