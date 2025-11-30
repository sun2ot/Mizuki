---
title: Labelimg 标注工具
published: 2023-12-01
category: 教程
tags: [数据标注, python, yolo]
# updated: 2023-12-01 11:16:58
# categories: [教程, 软件工程]
---

## 安装

切换到 conda 环境下，执行

``` powershell
pip install labelimg
```

{% note info modern %}
如果下载缓慢，请切换清华源，见 [pypi | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)
{% endnote %}

{% note warning modern %}
Python 环境最多只能为 3.9，Labelimg 不支持 3.10 以上版本
{% endnote %}

## 数据准备

首先这里需要准备我们需要打标注的数据集。这里我建议新建一个名为 `img_data` 的文件夹（这个是约定俗成，不这么做也行），里面创建一个名为 `images` 的文件夹存放我们需要打标签的图片文件；再创建一个名为 `labels` 存放标注的标签文件；最后创建一个名为 `classes.txt` 的 txt 文件来存放所要标注的类别名称。

![image.png](https://img.085404.xyz/images/934badc4977212eab1d5aa7bf9e9b66c.webp)

然后把要标注的图片放在 `images/` 下

![image.png](https://img.085404.xyz/images/42b59c80370fce396ed8ca2a905d1b6f.webp)

在 `classes.txt` 中写入所有用到的标签

![image.png](https://img.085404.xyz/images/16461fcd51820f60ac0650869abab39f.webp)

## 标注

### 启动 labelimg

从你的 conda prompt 进入数据集路径
> 不然你找不到 Labelimg 这个东西

![image.png](https://img.085404.xyz/images/f80f49998c94ad1718b8eb2b76b62c32.webp)


执行

```powershell
labelimg images classes.txt
```

拿下！

![image.png](https://img.085404.xyz/images/a71d9ab8745a9dc2f2ecbedbd4fe60df.webp)

### 开始标注

标注过程：
1. 选中左侧 `create rectbox`
2. 框选图片中主体
3. 选择图片标签（该标签来自于 `classes.txt` ）

![image.png](https://img.085404.xyz/images/b6f1673a8be9be65f34a8ca021b8cb95.webp)


### 保存标注

![image.png](https://img.085404.xyz/images/636f09cd8c89191e34ae3cc993fc106f.webp)

点击 `save` 下方的按钮可以切换保存的模式，此处切换为 `YOLO` 。不同的模型所需的标签格式不同，例如 `YOLO` 所需的标签类型即为 `txt` 。

点击 `save` ，将 `image_name.txt` 保存在刚刚创建的 `img_data\labels` 路径下。

{% note info modern %}
例如对一张名为 `aaa.jpg` 的图片进行了标注，则生成的对应标签为 `aaa.txt` （YOLO 模式下）
{% endnote %}



